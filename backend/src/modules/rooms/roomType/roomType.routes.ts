import { Router } from "express";
import { RoomTypeController } from "./roomType.controller.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";
import {
  createRoomTypeSchema,
  updateRoomTypeSchema,
  roomTypeIdSchema,
} from "./roomType.schema.ts";
import { ROLES } from "@lib/roles.ts";

const router = Router();

router.get("/", RoomTypeController.getAll);

router.get(
  "/:id",
  validateRequestMiddleware(roomTypeIdSchema, "params"),
  RoomTypeController.getById,
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN]),
  validateRequestMiddleware(createRoomTypeSchema),
  RoomTypeController.create,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN]),
  validateRequestMiddleware(roomTypeIdSchema, "params"),
  validateRequestMiddleware(updateRoomTypeSchema),
  RoomTypeController.update,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN]),
  validateRequestMiddleware(roomTypeIdSchema, "params"),
  RoomTypeController.delete,
);

export default router;
