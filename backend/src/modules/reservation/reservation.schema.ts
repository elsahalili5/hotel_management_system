import { z } from "zod";

export const availabilityQuerySchema = z.object({
  room_type_id: z.coerce.number().int().positive(),
  check_in_date: z.coerce.date(),
  check_out_date: z.coerce.date(),
}).refine((d) => d.check_out_date > d.check_in_date, {
  message: "check_out_date must be after check_in_date",
  path: ["check_out_date"],
});

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const createReservationSchema = z.object({
  room_type_id:  z.number().int().positive(),
  check_in_date: z.coerce.date().refine((d) => d >= today(), {
    message: "check_in_date cannot be in the past",
  }),
  check_out_date: z.coerce.date(),
  adults:        z.number().int().min(1),
  children:      z.number().int().min(0).default(0),
  meal_plan_id:  z.number().int().positive().optional(),
  payment_method: z.enum(["CASH", "CARD"]),
}).refine((d) => d.check_out_date > d.check_in_date, {
  message: "check_out_date must be after check_in_date",
  path: ["check_out_date"],
});