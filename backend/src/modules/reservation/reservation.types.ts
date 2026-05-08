import { z } from "zod";
import {
  availabilityQuerySchema,
  createReservationSchema,
} from "./reservation.schema.ts";
import { ReservationService } from "./reservation.service.ts";
export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type BookingTxParams = {
  guest: { id: number };
  availability: Awaited<
    ReturnType<typeof ReservationService.checkAvailability>
  >;
  input: CreateReservationInput;
  mealPlan: {
    name: string;
    price_per_night: number | { toNumber(): number };
  } | null;
  mealPlanCost: number;
  totalAmount: number;
};
