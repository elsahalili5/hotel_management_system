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

export type TypedRequest<
  Body = unknown,
  Params = Record<string, string>,
  Query = unknown,
> = Request<Params, any, Body, Query>;
