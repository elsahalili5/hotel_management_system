import { Router } from "express";
import { StaffController } from "../controllers/staffController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { roleMiddleware } from "../middleware/roleMiddleware.ts";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  StaffController.getStaff,
);

router.get("/:id", authMiddleware, StaffController.getStaffById);

router.patch("/:id", authMiddleware, StaffController.updateStaff);

export default router;
