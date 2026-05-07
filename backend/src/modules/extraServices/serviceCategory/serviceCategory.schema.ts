import { z } from "zod";
import { numericStringSchema } from "@lib/validations";

export const createServiceCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const updateServiceCategorySchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").optional(),
  description: z.string().trim().optional(),
  sort_order: z.coerce.number().int().optional(),
  is_active: z.boolean().optional(),
});

export const serviceCategoryIdSchema = z.object({
  id: numericStringSchema,
});