import { Router } from "express";
import { ServiceCategoryController } from "./serviceCategory.controller.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";
import {
  createServiceCategorySchema,
  updateServiceCategorySchema,
  serviceCategoryIdSchema,
} from "./serviceCategory.schema.ts";
import { ROLES } from "@lib/roles.ts";

const router = Router();

router.get("/", authMiddleware, ServiceCategoryController.getAll);

router.get(
  "/:id",
  authMiddleware,
  validateRequestMiddleware(serviceCategoryIdSchema, "params"),
  ServiceCategoryController.getById,
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(createServiceCategorySchema),
  ServiceCategoryController.create,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(serviceCategoryIdSchema, "params"),
  validateRequestMiddleware(updateServiceCategorySchema),
  ServiceCategoryController.update,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(serviceCategoryIdSchema, "params"),
  ServiceCategoryController.delete,
);

export default router;