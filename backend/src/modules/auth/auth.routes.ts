import { Router } from "express";
import { AuthController } from "./auth.controller.ts";
import {
  userLoginSchema,
  userRegisterSchema,
  refreshTokenSchema,
  logoutSchema,
} from "./auth.schema.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";

const router = Router();

router.post(
  "/login",
  validateRequestMiddleware(userLoginSchema),
  AuthController.loginUser,
);

router.post(
  "/register",
  validateRequestMiddleware(userRegisterSchema),
  AuthController.registerUser,
);

router.post(
  "/refresh-token",
  validateRequestMiddleware(refreshTokenSchema),
  AuthController.refreshToken,
);

router.post(
  "/logout",
  validateRequestMiddleware(logoutSchema),
  AuthController.logoutUser,
);

export default router;
