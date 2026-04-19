import { Response, NextFunction } from "express";
import { AuthRequest } from "@lib/types";

export const roleMiddleware = (roles: string[]) => {
  //  pra e prnaonn ni rolee kthen ni middleware function qe e merr request, response dhe next
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: no user found",
      });
    }

    const userRoles = req.user.user_roles?.map((ur) => ur.role?.name) || [];
    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        message: "Forbidden: You don't have permission",
      });
    }

    next();
  };
};
