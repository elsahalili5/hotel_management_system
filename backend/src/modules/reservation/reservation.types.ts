import { z } from "zod";
export {
  PaymentMethod,
  ReservationStatus,
  InvoiceStatus,
  PaymentStatus,
  RoomStatus,
} from "@generated/prisma/enums.ts";
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