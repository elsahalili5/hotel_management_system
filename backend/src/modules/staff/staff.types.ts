import { z } from "zod";
import { updateStaffSchema } from "./staff.schema";

export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
