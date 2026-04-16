import { Router } from "express";
import { RefreshTokenController } from "./refreshToken.controller.ts";
import { refreshTokenSchema } from "./refreshToken.schema.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";

const router = Router();

router.post(
  "/refresh-token",
  validateRequestMiddleware(refreshTokenSchema),
  RefreshTokenController.refreshToken,
);

export default router;
