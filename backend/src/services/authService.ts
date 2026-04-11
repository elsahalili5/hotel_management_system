import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcrypt";
import { UserStatus } from "../generated/prisma/enums.ts";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.ts";

const SALT_ROUNDS = 10;

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

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw { status: 400, message: "User already exists" };
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const guestRole = await prisma.role.findUnique({
      where: { name: "GUEST" },
    });

    if (!guestRole) {
      throw { status: 500, message: "Guest role not found" };
    }

    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password_hash,
        status: UserStatus.ACTIVE,
        user_roles: {
          create: { role_id: guestRole.id },
        },
        guest_profile: {
          create: {},
        },
      },
      include: {
        user_roles: { include: { role: true } },
        guest_profile: true,
      },
    });

    const { password_hash: _, ...safeUser } = user;

    return safeUser;
  },

  loginUser: async (payload: UserLoginPayload) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        user_roles: { include: { role: true } },
        guest_profile: true,
        staff_profile: true,
      },
    });

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw { status: 401, message: "Invalid credentials" };
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
    if (!refreshToken) {
      throw { status: 400, message: "Refresh token is required" };
    }

    const tokenRecord = await prisma.refreshTokens.findUnique({
      where: { token: refreshToken },
    });

    if (!tokenRecord) {
      throw { status: 404, message: "Token not found" };
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
