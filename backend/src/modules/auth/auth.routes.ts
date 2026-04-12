import { Router } from "express";
import { AuthController } from "./auth.controller.ts";
import { userLoginSchema, userRegisterSchema } from "./auth.schema.ts";
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

router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logoutUser);

export default router;
