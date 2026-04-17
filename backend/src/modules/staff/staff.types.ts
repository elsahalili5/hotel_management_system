import { z } from "zod";
import { updateStaffSchema, staffIdParamSchema } from "./staff.schema";

export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
export type StaffIdParam = z.infer<typeof staffIdParamSchema>;
