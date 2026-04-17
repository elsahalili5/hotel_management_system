import { z } from "zod";
import {
  userLoginSchema,
  userRegisterSchema,
  refreshTokenSchema,
  logoutSchema,
} from "./auth.schema";

export type RegisterUserInput = z.infer<typeof userRegisterSchema>;
export type LoginUserInput = z.infer<typeof userLoginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
