import { z } from "zod";
import { Shift } from "@generated/prisma/client";
import { numericStringSchema } from "@lib/validations";

export const shiftEnum = z.enum([Shift.MORNING, Shift.AFTERNOON, Shift.NIGHT]);

export const updateStaffSchema = z.object({
  phone_number: z.string().optional(),
  shift: shiftEnum.optional(),
  is_active: z.boolean().optional(),
});

export const staffIdParamSchema = z.object({
  id: numericStringSchema,
});
