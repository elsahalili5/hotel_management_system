import { z } from "zod";
import { ROLES } from "@lib/roles";
import { numericStringSchema } from "@lib/validations";

export const createGuestSchema = z.object({
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  email: z.email().trim(),
  password: z.string().trim().min(8).max(72),

  phone_number: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  passport_number: z.string().optional(),
  date_of_birth: z.coerce.date().optional(),
});

export const createStaffSchema = z.object({
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  email: z.email().trim(),
  password: z.string().trim().min(8).max(72),

  role: z.enum([ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST, ROLES.HOUSEKEEPING]),

  phone_number: z.string().optional(),
  shift: z.enum(["MORNING", "AFTERNOON", "NIGHT"]).optional(),
});
export const updateUserSchema = z.object({
  first_name: z.string().trim().min(1).optional(),
  last_name: z.string().trim().min(1).optional(),
  email: z.email().trim().optional(),
  password: z.string().trim().min(8).max(72).optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'LOCKED', 'DISABLED']).optional(),
  role: z.enum([ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST, ROLES.HOUSEKEEPING]).optional(),
  shift: z.enum(["MORNING", "AFTERNOON", "NIGHT"]).optional(),
});

export const userIdParamSchema = z.object({
  userId: numericStringSchema,
});
