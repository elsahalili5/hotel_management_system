import { prisma } from "@lib/prisma.ts";
import {
  AvailabilityQuery,
  CreateReservationInput,
  BookingTxParams,
} from "./reservation.types.ts";
import { PaymentMethod } from "@generated/prisma/enums.ts";

const ERRORS = {
  ROOM_TYPE_NOT_FOUND: { status: 404, message: "Room type not found" },
  GUEST_PROFILE_NOT_FOUND: {
    status: 403,
    message: "User does not have a guest profile",
  },
  NO_ROOMS_AVAILABLE: {
    status: 409,
    message: "No rooms available for the selected dates",
  },
  CAPACITY_EXCEEDED: {
    status: 400,
    message: "Number of guests exceeds room capacity",
  },
  MEAL_PLAN_NOT_FOUND: {
    status: 404,
    message: "Meal plan not found or inactive",
  },
};

const calcNights = (checkIn: Date, checkOut: Date) =>
  Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

// a ekziston një guest profil që i përket këtij user-i

const resolveGuest = async (userId: number) => {
  const guest = await prisma.guest.findUnique({ where: { user_id: userId } });
  if (!guest) throw ERRORS.GUEST_PROFILE_NOT_FOUND;
  return guest;
};
// kontrollon nëse ka meal plan dhe nëse po, sa kushton për netët e qëndrimit, nëse ka meal plan kthen edhe detajet e tij, nëse jo kthen null
const resolveMealPlan = async (
  meal_plan_id: number | null | undefined,
  nights: number,
) => {
  if (!meal_plan_id) return { cost: 0, mealPlan: null };
  const mealPlan = await prisma.mealPlan.findFirst({
    where: { id: meal_plan_id, is_active: true },
  });
  if (!mealPlan) throw ERRORS.MEAL_PLAN_NOT_FOUND;
  return { cost: Number(mealPlan.price_per_night) * nights, mealPlan };
};

const runBookingTransaction = async ({
  guest,
  availability,
  input,
  mealPlan,
  mealPlanCost,
  totalAmount,
}: BookingTxParams) => {
  const {
    check_in_date,
    check_out_date,
    adults,
    children,
    meal_plan_id,
    payment_method,
  } = input;
  const { nights, base_price, total_price: roomCost } = availability;

  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.create({
      data: {
        guest_id: guest.id,
        room_id: availability.room_id!,
        meal_plan_id: meal_plan_id ?? null,
        status: "PENDING",
        check_in_date,
        check_out_date,
        adults,
        children,
      },
    });

    const invoice = await tx.invoice.create({
      data: {
        reservation_id: reservation.id,
        status: "ISSUED",
        issued_at: new Date(),
        due_date: check_in_date,
      },
    });

    await tx.invoiceItem.create({
      data: {
        invoice_id: invoice.id,
        description: `Room — ${nights} night(s)`,
        quantity: nights,
        unit_price: base_price,
        total: roomCost,
      },
    });

    if (mealPlan && mealPlanCost > 0) {
      await tx.invoiceItem.create({
        data: {
          invoice_id: invoice.id,
          description: `Meal plan: ${mealPlan.name} — ${nights} night(s)`,
          quantity: nights,
          unit_price: Number(mealPlan.price_per_night),
          total: mealPlanCost,
        },
      });
    }

    await tx.payment.create({
      data: {
        invoice_id: invoice.id,
        amount: totalAmount,
        method: payment_method as PaymentMethod,
        status: "COMPLETED",
        paid_at: new Date(),
      },
    });

    return tx.reservation.update({
      where: { id: reservation.id },
      data: { status: "CONFIRMED" },
      include: {
        room: true,
        meal_plan: true,
        invoice: { include: { items: true, payments: true } },
      },
    });
  });
};

export const ReservationService = {
  checkAvailability: async ({
    room_type_id,
    check_in_date,
    check_out_date,
  }: AvailabilityQuery) => {
    const roomType = await prisma.roomType.findUnique({
      where: { id: room_type_id },
    });
    if (!roomType) throw ERRORS.ROOM_TYPE_NOT_FOUND;

    const occupied = await prisma.reservation.findMany({
      where: {
        room: { room_type_id: room_type_id },
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
        check_in_date: { lt: check_out_date },
        check_out_date: { gt: check_in_date },
      },
      select: { room_id: true },
    });

    const availableRoom = await prisma.room.findFirst({
      where: {
        room_type_id: room_type_id,
        status: "AVAILABLE",
        id: { notIn: occupied.map((r) => r.room_id) },
      },
    });

    const nights = calcNights(check_in_date, check_out_date);

    return {
      available: Boolean(availableRoom),
      room_id: availableRoom?.id,
      room_type_id,
      check_in_date,
      check_out_date,
      nights,
      base_price: Number(roomType.base_price),
      total_price: Number(roomType.base_price) * nights,
      max_occupancy: roomType.max_occupancy,
    };
  },

  createReservation: async (input: CreateReservationInput, userId: number) => {
    const {
      room_type_id,
      check_in_date,
      check_out_date,
      adults,
      children,
      meal_plan_id,
    } = input;

    const guest = await resolveGuest(userId);

    const availability = await ReservationService.checkAvailability({
      room_type_id,
      check_in_date,
      check_out_date,
    });
    if (!availability.available || !availability.room_id)
      throw ERRORS.NO_ROOMS_AVAILABLE;

    if (adults + children > availability.max_occupancy)
      throw ERRORS.CAPACITY_EXCEEDED;

    const { cost: mealPlanCost, mealPlan } = await resolveMealPlan(
      meal_plan_id,
      availability.nights,
    );
    const totalAmount = availability.total_price + mealPlanCost;

    return runBookingTransaction({
      guest,
      availability,
      input,
      mealPlan,
      mealPlanCost,
      totalAmount,
    });
  },
};
