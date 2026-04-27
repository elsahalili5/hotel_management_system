import { Router } from "express";
import { CleaningTaskController } from "./cleaningTask.controller.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";
import {
  cleaningTaskIdSchema,
  createCleaningTaskSchema,
  updateCleaningTaskStatusSchema,
  getCleaningTasksQuerySchema,
} from "./cleaningTask.schema.ts";
import { ROLES } from "@lib/roles.ts";

const router = Router();


router.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(getCleaningTasksQuerySchema, "query"),
  CleaningTaskController.getAll,
);


router.get(
  "/my-tasks",
  authMiddleware,
  roleMiddleware([ROLES.HOUSEKEEPING]),
  CleaningTaskController.getMyTasks,
);

// Manager/Admin: cakto detyr
router.post(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(createCleaningTaskSchema),
  CleaningTaskController.create,
);

// Housekeeping/Manager/Admin: ndrysho statusin e detyres
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.HOUSEKEEPING]),
  validateRequestMiddleware(cleaningTaskIdSchema, "params"),
  validateRequestMiddleware(updateCleaningTaskStatusSchema),
  CleaningTaskController.updateStatus,
);

// Admin/Manager: fshi detyren
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(cleaningTaskIdSchema, "params"),
  CleaningTaskController.delete,
);

export default router;
