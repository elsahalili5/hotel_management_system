import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.ts";
import { generateAccessToken } from "../utils/jwt.ts";

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw { status: 401, message: "Refresh token missing" };
  }

  const storedToken = await prisma.refreshTokens.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken || storedToken.revoked) {
    throw { status: 401, message: "Invalid refresh token" };
  }

  if (storedToken.expires < new Date()) {
    throw { status: 401, message: "Refresh token expired" };
  }

  const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
    userId: number;
  };

  const newAccessToken = generateAccessToken(decoded.userId);

  return {
    accessToken: newAccessToken,
  };
};
