// routes/staffRoutes.ts
import { Router } from "express";
import {
  getStaff,
  getStaffById,
  updateStaff,
} from "../controllers/staffController.ts";

const router = Router();
router.get("/", getStaff);

router.get("/:id", getStaffById);

router.put("/:id", updateStaff);

export default router;
