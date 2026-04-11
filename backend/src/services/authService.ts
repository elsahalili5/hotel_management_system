import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcrypt";
import { UserStatus } from "../generated/prisma/enums.ts";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.ts";

const SALT_ROUNDS = 10;
const MAX_FAILED_ATTEMPTS = 5;

interface UserRegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface UserLoginPayload {
  email: string;
  password: string;
}

export const AuthService = {
  registerUser: async (data: UserRegisterPayload) => {
    const { first_name, last_name, email, password } = data;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
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
        email: normalizedEmail,
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

  loginUser: async (payload: UserLoginPayload) => {
    const { email, password } = payload;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
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
      throw { status: 403, message: "Account is locked" };
    }

    if (user.status === UserStatus.DISABLED) {
      throw { status: 403, message: "Account has been disabled" };
    }

    if (user.status === UserStatus.PENDING) {
      throw { status: 403, message: "Account is not yet activated" };
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    // ❌ FAILED LOGIN FLOW
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

    // ✅ SUCCESS LOGIN → reset counter
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
