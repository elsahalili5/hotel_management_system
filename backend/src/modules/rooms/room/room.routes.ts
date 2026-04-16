import { Router } from "express";
import { RoomController } from "./room.controller.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";
import {
  roomIdSchema,
  createRoomSchema,
  updateRoomSchema,
  updateRoomStatusSchema,
} from "./room.schema.ts";
import { ROLES } from "@lib/roles.ts";

const router = Router();

router.get("/", authMiddleware, RoomController.getAll);

router.get(
  "/stats",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  RoomController.getStats,
);

router.get(
  "/:id",
  authMiddleware,
  validateRequestMiddleware(roomIdSchema, "params"),
  RoomController.getById,
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(createRoomSchema),
  RoomController.create,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(roomIdSchema, "params"),
  validateRequestMiddleware(updateRoomSchema),
  RoomController.update,
);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(roomIdSchema, "params"),
  validateRequestMiddleware(updateRoomStatusSchema),
  RoomController.updateStatus,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN]),
  validateRequestMiddleware(roomIdSchema, "params"),
  RoomController.delete,
);

export default router;
