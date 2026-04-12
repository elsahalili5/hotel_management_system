import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.ts";
import { UserStatus } from "../generated/prisma/enums.ts";
import { AuthRequest } from "../utils/types.ts";

if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is missing in .env file");
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token format",
      });
    }

    const decoded = jwt.verify(token, ACCESS_SECRET) as {
      userId: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        user_roles: { include: { role: true } },
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
      });
    }

    if (user.status === UserStatus.LOCKED) {
      return res.status(403).json({
        message: "Forbidden: Account is locked",
      });
    }

    if (user.status === UserStatus.DISABLED) {
      return res.status(403).json({
        message: "Forbidden: Account is disabled",
      });
    }

    if (user.status === UserStatus.PENDING) {
      return res.status(403).json({
        message: "Forbidden: Account not activated",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
