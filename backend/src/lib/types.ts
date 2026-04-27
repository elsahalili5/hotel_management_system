import { Prisma } from "../generated/prisma/client";
import { Request } from "express";


export type AuthUser = Prisma.UserGetPayload<{
  include: {
    user_roles: {
      include: {
        role: true;
      };
    };
    guest_profile: true;
    staff_profile: true;
  };
}>;


export interface AuthRequest extends Request {
  user?: AuthUser;
}


export type TypedRequest<
  Body = unknown,
  Params = Record<string, string>,
  Query = unknown,
> = Request<Params, any, Body, Query>;
