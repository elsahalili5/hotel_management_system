import { z } from "zod";
import { refreshTokenSchema } from "./refreshToken.schema";

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
