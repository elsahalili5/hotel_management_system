import { z } from "zod";

export const availabilityQuerySchema = z.object({
  room_type_id: z.coerce.number().int().positive(),
  check_in_date: z.coerce.date(),
  check_out_date: z.coerce.date(),
}).refine((d) => d.check_out_date > d.check_in_date, {
  message: "check_out_date must be after check_in_date",
  path: ["check_out_date"],
});