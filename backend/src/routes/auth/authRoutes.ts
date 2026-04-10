// routes/authRoutes.ts
import { Router } from "express";
import { AuthController } from "../../controllers/authController";

const router = Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);

export default router;
