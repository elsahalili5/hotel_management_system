import { z } from "zod";
import { 
  bedIdSchema, 
  createBedSchema, 
  updateBedSchema 
} from "./bed.schema.ts";


export type BedId = z.infer<typeof bedIdSchema>["id"];


export type CreateBedInput = z.infer<typeof createBedSchema>;
export type UpdateBedInput = z.infer<typeof updateBedSchema>;

