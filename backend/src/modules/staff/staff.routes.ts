import { Router } from "express";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";

import { StaffController } from "@modules/staff/staff.controller.ts";
import { ROLES } from "@lib/roles.ts";

import { updateStaffSchema, staffIdParamSchema } from "./staff.schema.ts";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  StaffController.getStaff,
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(staffIdParamSchema, "params"),
  StaffController.getStaffById,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(staffIdParamSchema, "params"),
  validateRequestMiddleware(updateStaffSchema),
  StaffController.updateStaff,
);

export default router;
