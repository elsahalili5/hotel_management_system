import { Router } from "express";
import { UserController } from "./user.controller.ts";
import { ROLES } from "@lib/roles.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";

const router = Router();

router.post(
  "/create-guest",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST]),
  UserController.createGuest,
);

// Create staff,
router.post(
  "/create-staff",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST]),
  UserController.createStaff,
);

// get users
router.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  UserController.getUsers,
);

// get user by id
router.get(
  "/:userId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  UserController.getUserById,
);

// update user
router.put(
  "/:userId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  UserController.updateUser,
);

export default router;
