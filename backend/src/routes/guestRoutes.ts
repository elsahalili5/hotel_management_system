import { Router } from "express";
import { GuestController } from "../controllers/guestController.ts";

const router = Router();

router.get("/", GuestController.getGuests);
router.get("/:id", GuestController.getGuestById);
router.put("/:id", GuestController.updateGuest);

export default router;
