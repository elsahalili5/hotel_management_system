import { Router } from "express";
import { GuestController } from "../controllers/guestController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { roleMiddleware } from "../middleware/roleMiddleware.ts";

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
