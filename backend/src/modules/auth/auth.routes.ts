import { Router } from "express";
import { AuthController } from "./auth.controller.ts";
import { validateRequest } from "../../shared/middleware/validateRequest.ts";
import { userLoginSchema, userRegisterSchema } from "./auth.schema.ts";

const router = Router();

router.post(
  "/login",
  validateRequest(userLoginSchema),
  AuthController.loginUser,
);

router.post(
  "/register",
  validateRequest(userRegisterSchema),
  AuthController.registerUser,
);

router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logoutUser);

export default router;
