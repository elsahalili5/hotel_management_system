import { Router } from "express";
import { ReservationController } from "./reservation.controller.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import { availabilityQuerySchema } from "./reservation.schema.ts";

const router = Router();

router.get(
  "/availability",
  authMiddleware,
  validateRequestMiddleware(availabilityQuerySchema, "query"),
  ReservationController.checkAvailability,
);

export default router;