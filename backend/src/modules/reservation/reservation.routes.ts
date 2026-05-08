import { Router } from "express";
import { ReservationController } from "./reservation.controller.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";
import {
  availabilityQuerySchema,
  createReservationSchema,
} from "./reservation.schema.ts";
import { userIdParamSchema } from "@modules/users/user.schema.ts";

const router = Router();

router.get(
  "/availability",
  authMiddleware,
  validateRequestMiddleware(availabilityQuerySchema, "query"),
  ReservationController.checkAvailability,
);

router.post(
  "/",
  authMiddleware,
  validateRequestMiddleware(createReservationSchema, "body"),
  ReservationController.createReservation,
);

router.post(
  "/:userId",
  authMiddleware,
  roleMiddleware(["ADMIN", "MANAGER", "RECEPTIONIST"]),
  validateRequestMiddleware(userIdParamSchema, "params"),
  validateRequestMiddleware(createReservationSchema, "body"),
  ReservationController.createReservationForGuest,
);

export default router;
