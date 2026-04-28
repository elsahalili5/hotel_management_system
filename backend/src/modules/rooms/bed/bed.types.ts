import { z } from "zod";
import { bedIdSchema, createBedSchema, updateBedSchema } from "./bed.schema.ts";

export type BedIdParam = z.infer<typeof bedIdSchema>;
export type CreateBedInput = z.infer<typeof createBedSchema>;
export type UpdateBedInput = z.infer<typeof updateBedSchema>;
export type BedResponse = { id: number; name: string; capacity: number };
