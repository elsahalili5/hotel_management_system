import jwt from "jsonwebtoken";
import { prisma } from "@lib/prisma.ts";
import { generateAccessToken } from "@lib/jwt.ts";
import { UserStatus } from "@generated/prisma/enums.ts";
import { RefreshTokenInput } from "./refreshToken.types.ts";

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw { status: 401, message: "Refresh token missing" };
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

  let decoded: { userId: number };

  try {
    decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
      userId: number;
    };
  } catch {
    throw { status: 401, message: "Invalid refresh token" };
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

  return {
    accessToken: newAccessToken,
  };
};
