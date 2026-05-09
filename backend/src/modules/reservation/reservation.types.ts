import { z } from "zod";
import {
  availabilityQuerySchema,
  createReservationGuestSchema,
  checkoutSchema,
  reservationIdParamSchema,
} from "./reservation.schema.ts";
import { ReservationService } from "./reservation.service.ts";

export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;
export type CreateReservationInput = z.infer<typeof createReservationGuestSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ReservationIdParam = z.infer<typeof reservationIdParamSchema>;

export type ReservationResponse = {
  id: number
  status: string
  check_in_date: Date
  check_out_date: Date
  adults: number
  children: number
  created_at: Date
  guest: {
    id: number
    phone_number: string | null
    user: { first_name: string; last_name: string; email: string }
  }
  room: {
    id: number
    room_number: string
    room_type: { name: string; base_price: unknown }
  }
  meal_plan: { id: number; name: string; price_per_night: unknown } | null
  invoice: {
    id: number
    status: string
    items: { description: string; quantity: number; total: unknown }[]
    payments: { amount: unknown; method: string; paid_at: Date }[]
  } | null
}

export type BookingTxParams = {
  guest: { id: number };
  availability: Awaited<ReturnType<typeof ReservationService.checkAvailability>>;
  children: number;
  mealPlan: { name: string; price_per_night: number | { toNumber(): number } } | null;
  mealPlanCost: number;
  childrenDiscount: number;
  prepaidAmount: number;
  paymentMethod: "CASH" | "CARD";
  meal_plan_id?: number | null;
  check_in_date: Date;
  check_out_date: Date;
  adults: number;
};