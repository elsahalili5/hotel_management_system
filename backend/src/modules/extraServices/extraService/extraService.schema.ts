import { numericStringSchema } from "@lib/validations";
import { z } from "zod";

export const extraServiceIdParamSchema = z.object({
  id: numericStringSchema,
});

export const createExtraServiceSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  is_active: z.boolean().default(true),
  is_available_24h: z.boolean().default(false),
  available_from: z.string().trim().optional(),
  available_until: z.string().trim().optional(),
  category_id: z.coerce.number().int().positive("Category is required"),
});

export const updateExtraServiceSchema = z
  .object({
    name: z.string().trim().min(1, "Name cannot be empty").optional(),
    description: z.string().trim().optional(),
    price: z.coerce.number().positive("Price must be positive").optional(),
    is_active: z.boolean().optional(),
    is_available_24h: z.boolean().optional(),
    available_from: z.string().trim().optional(),
    available_until: z.string().trim().optional(),
    category_id: z.coerce.number().int().positive().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "No fields provided to update",
  });
