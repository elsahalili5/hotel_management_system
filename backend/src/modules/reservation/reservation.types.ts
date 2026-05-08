import { z } from "zod";
import { availabilityQuerySchema } from "./reservation.schema.ts";

export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;