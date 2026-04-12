import { Router } from "express";
import { GuestController } from "./guest.controller.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";

import { ROLES } from "@lib/roles.ts";
import { guestIdParamSchema, updateGuestSchema } from "./guest.schema.ts";

const router = Router();

// vetëm ADMIN, MANAGER, RECEPTIONIST
router.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST]),
  GuestController.getGuests,
);

// ADMIN + OWNER
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.GUEST]),
  validateRequestMiddleware(guestIdParamSchema),
  GuestController.getGuestById,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.GUEST]),
  validateRequestMiddleware(guestIdParamSchema),
  validateRequestMiddleware(updateGuestSchema),
  GuestController.updateGuest,
);

export default router;
