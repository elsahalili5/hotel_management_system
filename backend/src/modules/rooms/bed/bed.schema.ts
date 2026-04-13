import { z } from "zod";


export const bedIdSchema = z.object({
  id: z.coerce
    .number({ message: "ID must be a valid number" })
    .int()
    .positive("ID must be a positive number"),
});


export const createBedSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Bed name is required")
    .max(50, "Bed name is too long"),
  
  capacity: z.coerce
    .number({ message: "Capacity must be a number" })
    .int()
    .positive("Capacity must be at least 1"),
});


export const updateBedSchema = createBedSchema.partial().refine(
  (data) => data.name !== undefined || data.capacity !== undefined,
  {
    message: "At least one field (name or capacity) must be provided",
  }
);