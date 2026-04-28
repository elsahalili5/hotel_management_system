import { z } from "zod";
import {
  createAmenitySchema,
  updateAmenitySchema,
  amenityIdSchema,
} from "./amenity.schema.ts";

export type CreateAmenityInput = z.infer<typeof createAmenitySchema>;
export type UpdateAmenityInput = z.infer<typeof updateAmenitySchema>;
export type AmenityIdParam = z.infer<typeof amenityIdSchema>;
export type AmenityResponse = { id: number; name: string; icon: string | null };
