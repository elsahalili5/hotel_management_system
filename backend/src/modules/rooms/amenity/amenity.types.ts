import { z } from "zod";
import {
  createAmenitySchema,
  updateAmenitySchema,
  amenityIdSchema
} from "./amenity.schema.ts";

export type CreateAmenityInput = z.infer<typeof createAmenitySchema>;
export type UpdateAmenityInput = z.infer<typeof updateAmenitySchema>;
export type AmenityId = z.infer<typeof amenityIdSchema>["id"];


