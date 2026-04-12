import { Router } from "express";
import { GuestController } from "./guest.controller.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "STAFF"]),
  GuestController.getGuests,
);
router.get("/:id", authMiddleware, GuestController.getGuestById);
router.patch("/:id", authMiddleware, GuestController.updateGuest);

export default router;
