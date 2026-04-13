import { Router } from "express";
import { AmenityController } from "./amenity.controller.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";
import { createAmenitySchema, updateAmenitySchema, amenityIdSchema } from "./amenity.schema.ts";
import { ROLES } from "@lib/roles.ts";

const router = Router();

router.get(
  "/", 
  authMiddleware, 
  AmenityController.getAll
);

router.get(
  "/:id", 
  authMiddleware, 
  validateRequestMiddleware(amenityIdSchema, "params"), 
  AmenityController.getById
);



router.post(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(createAmenitySchema),
  AmenityController.create
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(amenityIdSchema, "params"),
  validateRequestMiddleware(updateAmenitySchema),
  AmenityController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(amenityIdSchema, "params"),
  AmenityController.delete
);

export default router;