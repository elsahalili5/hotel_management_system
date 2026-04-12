import { Router } from "express";
import { authMiddleware } from "@shared/middleware/authMiddleware";
import { roleMiddleware } from "@shared/middleware/roleMiddleware";
import { StaffController } from "@modules/staff/staff.controller";
import { ROLES } from "@lib/roles";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  StaffController.getStaff,
);

router.get("/:id", authMiddleware, StaffController.getStaffById);

router.patch("/:id", authMiddleware, StaffController.updateStaff);

export default router;
