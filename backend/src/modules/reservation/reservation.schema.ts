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

const baseFields = z.object({
  room_type_id:   z.number().int().positive(),
  check_in_date:  z.coerce.date().refine((d) => d >= today(), {
    message: "check_in_date cannot be in the past",
  }),
  check_out_date: z.coerce.date(),
  adults:         z.number().int().min(1),
  children:       z.number().int().min(0).default(0),
  meal_plan_id:   z.number().int().positive().optional(),
}).refine((d) => d.check_out_date > d.check_in_date, {
  message: "check_out_date must be after check_in_date",
  path: ["check_out_date"],
});

// Guest self-booking
export const createReservationGuestSchema = baseFields;

// Staff booking for a guest — same fields
export const createReservationStaffSchema = baseFields;

// Checkout — staff selects payment method at the end
export const checkoutSchema = z.object({
  payment_method: z.enum(["CASH", "CARD"]),
});

export const reservationIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});