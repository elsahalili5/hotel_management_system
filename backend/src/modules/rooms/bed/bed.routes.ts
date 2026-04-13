import { Router } from "express";
import { BedController } from "./bed.controller.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";
import { createBedSchema, updateBedSchema, bedIdSchema } from "./bed.schema.ts";
import { ROLES } from "@lib/roles.ts";

const router = Router();


router.get(
  "/", 
  authMiddleware, 
  BedController.getAll
);

router.get(
  "/:id", 
  authMiddleware, 
  validateRequestMiddleware(bedIdSchema, "params"), 
  BedController.getById
);



router.post(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(createBedSchema),
  BedController.create
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(bedIdSchema, "params"),
  validateRequestMiddleware(updateBedSchema),
  BedController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(bedIdSchema, "params"),
  BedController.delete
);

export default router;