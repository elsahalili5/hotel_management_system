import { z } from "zod";
import { Shift } from "@generated/prisma/client";

export const shiftEnum = z.enum([Shift.MORNING, Shift.AFTERNOON, Shift.NIGHT]);

export const updateStaffSchema = z.object({
  phone_number: z.string().optional(),
  shift: shiftEnum.optional(),
  is_active: z.boolean().optional(),
});
