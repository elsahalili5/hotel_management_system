import { z } from "zod";

export const guestIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateGuestSchema = z.object({
  phone_number: z.string().trim().optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),
  passport_number: z.string().trim().optional(),
  date_of_birth: z.coerce.date().optional(),
});
