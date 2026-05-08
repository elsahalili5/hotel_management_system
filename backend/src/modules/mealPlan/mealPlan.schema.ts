import { numericStringSchema } from "@lib/validations";
import { z } from "zod";

export const mealPlanIdParamSchema = z.object({
  id: numericStringSchema,
});

export const createMealPlanSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  price_per_night: z.coerce.number().positive("Price per night must be positive"),
  is_active: z.boolean().default(true),
});

export const updateMealPlanSchema = z
  .object({
    name: z.string().trim().min(1, "Name cannot be empty").optional(),
    description: z.string().trim().optional(),
    price_per_night: z.coerce.number().positive("Price per night must be positive").optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "No fields provided to update",
  });
