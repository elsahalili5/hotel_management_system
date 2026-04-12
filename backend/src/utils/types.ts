import { Prisma } from "../generated/prisma/client";
import { Request } from "express";

export interface AuthRequest extends Request {
  user?: Prisma.UserGetPayload<{
    include: {
      user_roles: {
        include: {
          role: true;
        };
      };
    };
  }>;
}

export type TypedRequestBody<T> = Request<{}, {}, T>;
