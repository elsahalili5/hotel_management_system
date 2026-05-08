import { z } from "zod";
import {
  mealPlanIdParamSchema,
  createMealPlanSchema,
  updateMealPlanSchema,
} from "./mealPlan.schema.ts";

export type MealPlanIdParam = z.infer<typeof mealPlanIdParamSchema>;
export type CreateMealPlanInput = z.infer<typeof createMealPlanSchema>;
export type UpdateMealPlanInput = z.infer<typeof updateMealPlanSchema>;

export type MealPlanResponse = {
  id: number;
  name: string;
  description: string | null;
  price_per_night: string;
  is_active: boolean;
};
