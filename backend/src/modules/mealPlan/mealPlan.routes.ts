import { Router } from "express";
import { MealPlanController } from "./mealPlan.controller.ts";
import { authMiddleware } from "@shared/middleware/authMiddleware.ts";
import { roleMiddleware } from "@shared/middleware/roleMiddleware.ts";
import { validateRequestMiddleware } from "@shared/middleware/validateRequest.middleware.ts";
import { ROLES } from "@lib/roles.ts";
import {
  mealPlanIdParamSchema,
  createMealPlanSchema,
  updateMealPlanSchema,
} from "./mealPlan.schema.ts";

const router = Router();

router.get(
  "/",
  authMiddleware,
  MealPlanController.getMealPlans,
);

router.get(
  "/:id",
  authMiddleware,
  validateRequestMiddleware(mealPlanIdParamSchema, "params"),
  MealPlanController.getMealPlanById,
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(createMealPlanSchema),
  MealPlanController.createMealPlan,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(mealPlanIdParamSchema, "params"),
  validateRequestMiddleware(updateMealPlanSchema),
  MealPlanController.updateMealPlan,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validateRequestMiddleware(mealPlanIdParamSchema, "params"),
  MealPlanController.deleteMealPlan,
);

export default router;
