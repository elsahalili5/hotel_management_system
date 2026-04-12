import { Router } from "express";
import { UserController } from "../../controllers/users/userController.ts";
import { authMiddleware } from "../../middleware/authMiddleware.ts";
import { roleMiddleware } from "../../middleware/roleMiddleware.ts";
import { ROLES } from "../../utils/roles.ts";

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

// udpdate user
router.delete(
  "/:userId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  UserController.deleteUser,
);

export default router;
