import { z } from "zod";

export const createAmenitySchema = z.object({
  name: z.string().trim().min(1, "Amenity name is required"),
  icon: z.string().trim().optional(),
});

export const updateAmenitySchema = z
  .object({
    name: z.string().trim().min(1, "Amenity name cannot be empty").optional(),
    icon: z.string().trim().optional(),
  })
  .refine((data) => data.name !== undefined || data.icon !== undefined, {
    message: "At least one field (name or icon) must be provided",
  });

export const amenityIdSchema = z.object({
  id: z.coerce
    .number({ message: "ID must be a valid number" })
    .int()
    .positive("ID must be a positive number"),
});