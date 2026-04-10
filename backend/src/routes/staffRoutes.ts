import { Router } from "express";
import { StaffController } from "../controllers/staffController.ts";

const router = Router();

router.get("/", StaffController.getStaff);
router.get("/:id", StaffController.getStaffById);
router.put("/:id", StaffController.updateStaff);

export default router;
