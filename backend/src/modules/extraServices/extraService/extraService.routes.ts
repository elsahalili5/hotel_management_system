import { Router } from "express";
import { ExtraServiceController } from "./extraService.controller.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import { ROLES } from "@lib/roles.ts";
import {
  extraServiceIdParamSchema,
  createExtraServiceSchema,
  updateExtraServiceSchema,
} from "./extraService.schema.ts";

const router = Router();

router.get(
  "/",
  authMiddleware,
  ExtraServiceController.getExtraServices,
);

router.get(
  "/:id",
  authMiddleware,
  validateRequestMiddleware(extraServiceIdParamSchema, "params"),
  ExtraServiceController.getExtraServiceById,
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(createExtraServiceSchema),
  ExtraServiceController.createExtraService,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(extraServiceIdParamSchema, "params"),
  validateRequestMiddleware(updateExtraServiceSchema),
  ExtraServiceController.updateExtraService,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(extraServiceIdParamSchema, "params"),
  ExtraServiceController.deleteExtraService,
);

export default router;
