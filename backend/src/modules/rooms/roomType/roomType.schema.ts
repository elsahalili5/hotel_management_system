import { z } from "zod";
import { numericStringSchema } from "@lib/validations";

export const roomTypeIdSchema = z.object({
  id: numericStringSchema,
});

export const createRoomTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
    
  description: z
    .string()
    .trim()
    .max(1000, "Description is too long")
    .optional()
    .nullable(),

  base_price: z.coerce
    .number({ message: "Base price must be a number" })
    .positive("Price must be a positive value")
    .multipleOf(0.01, "Price cannot have more than 2 decimal places"),

  max_occupancy: z.coerce
    .number()
    .int()
    .min(1, "Occupancy must be at least 1 person")
    .max(20, "Occupancy seems too high"),

  size_m2: z.coerce
    .number()
    .int()
    .positive("Size must be a positive number")
    .optional()
    .nullable(),

 
  amenities: z
    .array(z.number().int().positive())
    .optional()
    .describe("Array of Amenity IDs"),

  beds: z
    .array(
      z.object({
        bed_id: z.number().int().positive(),
        quantity: z.number().int().min(1)
      })
    )
    .optional(),

  images: z
    .array(
      z.object({
        url: z.string().url("Invalid image URL"),
        is_primary: z.boolean().optional().default(false),
        alt_text: z.string().optional()
      })
    )
    .optional()
});

export const updateRoomTypeSchema = createRoomTypeSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided for update",
  }
);