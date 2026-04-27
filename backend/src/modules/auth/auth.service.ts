import { prisma } from "@lib/prisma.ts";
import bcrypt from "bcrypt";
import { UserStatus } from "@generated/prisma/enums.ts";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@lib/jwt.ts";
import {
  LoginUserInput,
  RegisterUserInput,
  RefreshTokenInput,
  LogoutInput,
  LoginUserResponse,
} from "./auth.types.ts";
import { safeUserSelect } from "@lib/constants.ts";

const SALT_ROUNDS = 10;
// dmth nr i perseritjeve te hashimit te passwordit, sa me i larte aq me i sigurt eshte passwordi, por edhe me shume kohe merr per tu hash-uar
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minuta

export const AuthService = {
  registerUser: async (data: RegisterUserInput) => {
    const { first_name, last_name, email, password } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw { status: 409, message: "User already exists" };
    }

    const guestRole = await prisma.role.findUnique({
      where: { name: "GUEST" },
    });

    if (!guestRole) {
      throw { status: 500, message: "Guest role not found" };
    }
    // salt round tregon dmth sa her e forcon paswordin
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email,
        password_hash,
        status: UserStatus.ACTIVE,
        user_roles: {
          create: { role_id: guestRole.id },
        },
        guest_profile: {
          create: {},
        },
      },
      select: {
        ...safeUserSelect,
        guest_profile: true,
        created_at: true,
      },
    });

    return user;
  },

  loginUser: async (payload: LoginUserInput): Promise<LoginUserResponse> => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        user_roles: { include: { role: true } },
        guest_profile: true,
        staff_profile: true,
      },
    });

    if (!user) {
      throw { status: 401, message: "Invalid credentials" };
    }

    if (user.status === UserStatus.LOCKED) {
      if (user.locked_until && user.locked_until <= new Date()) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            status: UserStatus.ACTIVE,
            access_failed_count: 0,
            locked_until: null,
          },
        });
        user.status = UserStatus.ACTIVE;
        user.access_failed_count = 0;
        user.locked_until = null;
      } else {
        throw {
          status: 403,
          message: user.locked_until
            ? `Account locked until ${user.locked_until.toISOString()}`
            : "Account access denied",
        };
      }
    }

    if (
      user.status === UserStatus.DISABLED ||
      user.status === UserStatus.PENDING
    ) {
      throw {
        status: 403,
        message: "Account access denied",
      };
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      if (user.lockout_enabled) {
        const newCount = user.access_failed_count + 1;

        const isLocking = newCount >= MAX_FAILED_ATTEMPTS;
        const lockedUntil = isLocking
          ? new Date(Date.now() + LOCKOUT_DURATION_MS)
          : undefined;

        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            access_failed_count: newCount,
            status: isLocking ? UserStatus.LOCKED : user.status,
            locked_until: lockedUntil,
          },
        });

        if (updatedUser.status === UserStatus.LOCKED) {
          throw {
            status: 403,
            message: `Account locked until ${updatedUser.locked_until!.toISOString()}`,
          };
        }
      }

      throw { status: 401, message: "Invalid credentials" };
    }

    if (user.access_failed_count !== 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          access_failed_count: 0,
        },
      });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshTokens.create({
      data: {
        user_id: user.id,
        token: refreshToken,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false,
      },
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  },
  refreshAccessToken: async (data: RefreshTokenInput) => {
    const { refreshToken } = data;

    let decoded: { userId: number };

    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw { status: 401, message: "Invalid refresh token" };
    }

    const storedToken = await prisma.refreshTokens.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw { status: 401, message: "Invalid refresh token" };
    }

    if (storedToken.revoked) {
      throw { status: 401, message: "Token revoked" };
    }

    if (storedToken.expires < new Date()) {
      throw { status: 401, message: "Refresh token expired" };
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw { status: 401, message: "User not found" };
    }

    if (
      user.status === UserStatus.LOCKED ||
      user.status === UserStatus.DISABLED ||
      user.status === UserStatus.PENDING
    ) {
      throw {
        status: 403,
        message: "Account not allowed to refresh token",
      };
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.refreshTokens.update({
      where: { token: refreshToken },
      data: { revoked: true },
    });

    await prisma.refreshTokens.create({
      data: {
        user_id: user.id,
        token: newRefreshToken,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  logoutUser: async (data: LogoutInput) => {
    const { refreshToken } = data;
    const tokenRecord = await prisma.refreshTokens.findUnique({
      where: { token: refreshToken },
    });

    if (!tokenRecord) {
      throw { status: 401, message: "Invalid token" };
    }

    if (tokenRecord.revoked) {
      return { message: "Already logged out" };
    }

    await prisma.refreshTokens.update({
      where: { token: refreshToken },
      data: {
        revoked: true,
      },
    });

    return {
      message: "Logged out successfully",
    };
  },
};
