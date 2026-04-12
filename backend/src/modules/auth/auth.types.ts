import { z } from "zod";
import { userLoginSchema, userRegisterSchema } from "./auth.schema";

export type RegisterUserInput = z.infer<typeof userRegisterSchema>;
export type LoginUserInput = z.infer<typeof userLoginSchema>;
