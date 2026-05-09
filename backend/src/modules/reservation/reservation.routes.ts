import { Router } from "express";
import { ReservationController } from "./reservation.controller.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";
import {
  availabilityQuerySchema,
  createReservationGuestSchema,
  checkoutSchema,
  reservationIdParamSchema,
} from "./reservation.schema.ts";

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
  roleMiddleware(["GUEST"]),
  validateRequestMiddleware(createReservationGuestSchema, "body"),
  ReservationController.createReservation,
);

// Checkout — staff pays the full invoice
router.post(
  "/:id/checkout",
  authMiddleware,
  roleMiddleware(["ADMIN", "MANAGER", "RECEPTIONIST"]),
  validateRequestMiddleware(reservationIdParamSchema, "params"),
  validateRequestMiddleware(checkoutSchema, "body"),
  ReservationController.checkout,

);
router.get(
  "/my-reservations",
  authMiddleware,
  roleMiddleware(["GUEST"]),
  ReservationController.getMyReservations,
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "MANAGER", "RECEPTIONIST"]),
  ReservationController.getAll,
);

router.get(
  "/today",
  authMiddleware,
  roleMiddleware(["ADMIN", "MANAGER", "RECEPTIONIST"]),
  ReservationController.getTodaysCheckIns,
);
export default router;