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
} from "./auth.types.ts";

const SALT_ROUNDS = 10;
const MAX_FAILED_ATTEMPTS = 5;

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
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        status: true,
        user_roles: { include: { role: true } },
        guest_profile: true,
        created_at: true,
      },
    });

    return user;
  },

  loginUser: async (payload: LoginUserInput) => {
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

    if (
      user.status === UserStatus.LOCKED ||
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

        await prisma.user.update({
          where: { id: user.id },
          data: {
            access_failed_count: newCount,
            status:
              newCount >= MAX_FAILED_ATTEMPTS ? UserStatus.LOCKED : user.status,
          },
        });
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
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        status: user.status,
        email_confirmed: user.email_confirmed,
        user_roles: user.user_roles,
        guest_profile: user.guest_profile,
        staff_profile: user.staff_profile,
      },
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
