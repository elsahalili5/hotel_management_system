import { Router } from "express";
import { UserController } from "./user.controller.ts";
import { ROLES } from "@lib/roles.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import {
  createGuestSchema,
  createStaffSchema,
  updateUserSchema,
  userIdParamSchema,
} from "./user.schema.ts";

const router = Router();

router.post(
  "/create-guest",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(createGuestSchema),
  UserController.createGuest,
);

router.post(
  "/create-staff",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(createStaffSchema),
  UserController.createStaff,
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  UserController.getUsers,
);

router.get(
  "/:userId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(userIdParamSchema, "params"),
  UserController.getUserById,
);

router.put(
  "/:userId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(userIdParamSchema, "params"),
  validateRequestMiddleware(updateUserSchema),
  UserController.updateUser,
);

router.delete(
  "/:userId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(userIdParamSchema, "params"),
  UserController.deleteUser,
);

export default router;
