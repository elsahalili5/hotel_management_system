import { Router } from "express";
import { ReviewController } from "./review.controller.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import { ROLES } from "@lib/roles.ts";
import { createReviewSchema, reviewIdParamSchema } from "./review.schema.ts";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST]),
  ReviewController.getAll,
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.GUEST]),
  validateRequestMiddleware(createReviewSchema),
  ReviewController.create,
);

router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(reviewIdParamSchema, "params"),
  ReviewController.approve,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(reviewIdParamSchema, "params"),
  ReviewController.remove,
);

export default router;
