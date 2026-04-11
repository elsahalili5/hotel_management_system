import { prisma } from "../lib/prisma.ts";

export const logoutUser = async (refreshToken: string) => {
  if (!refreshToken) {
    throw { status: 400, message: "Refresh token is required" };
  }

  const storedToken = await prisma.refreshTokens.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken) {
    throw { status: 404, message: "Refresh token not found" };
  }

  if (storedToken.revoked) {
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
};
