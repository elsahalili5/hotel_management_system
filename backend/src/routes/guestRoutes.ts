// routes/guestRoutes.ts
import { Router } from "express";
import {
  getGuests,
  getGuestById,
  updateGuest, // Shto këtë import
} from "../controllers/guestController.ts";

const router = Router();

router.get("/", getGuests);
router.get("/:id", getGuestById);
router.put("/:id", updateGuest);

export default router;
