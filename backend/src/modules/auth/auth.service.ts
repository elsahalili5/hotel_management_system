import { prisma } from "../../lib/prisma.ts";
import bcrypt from "bcrypt";
import { UserStatus } from "../../generated/prisma/enums.ts";
import { generateAccessToken, generateRefreshToken } from "../../lib/jwt.ts";
import { LoginUserInput, RegisterUserInput } from "./auth.types.ts";

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
        user_roles: true,
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

    // 🔒 INITIAL STATUS CHECK
    if (
      user.status === UserStatus.LOCKED ||
      user.status === UserStatus.DISABLED ||
      user.status === UserStatus.PENDING
    ) {
      throw {
        status: 403,
        message: `Account not allowed: ${user.status}`,
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

    const freshUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (
      !freshUser ||
      freshUser.status === UserStatus.LOCKED ||
      freshUser.status === UserStatus.DISABLED ||
      freshUser.status === UserStatus.PENDING
    ) {
      throw {
        status: 403,
        message: "Account is not allowed to login",
      };
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

    const { password_hash, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  },

  logoutUser: async (refreshToken: string) => {
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
