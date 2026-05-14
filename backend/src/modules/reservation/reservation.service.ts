import { prisma } from "@lib/prisma.ts";
import {
  AvailabilityQuery,
  CreateReservationInput,
  CheckoutInput,
  BookingTxParams,
} from "./reservation.types.ts";
import { InvoiceService } from "@modules/invoice/invoice.service.ts";
import { PaymentService } from "@modules/payment/payment.service.ts";
import {
  PaymentMethod,
  ReservationStatus,
  InvoiceStatus,
  PaymentStatus,
  RoomStatus,
} from "@generated/prisma/enums.ts";

const CHILD_DISCOUNT_RATE = 0.1; 

const reservationSelect = {
  id: true,
  check_in_date: true,
  check_out_date: true,
  status: true,
  adults: true,
  children: true,
  created_at: true,
  checked_in_at: true,
  
  guest: {
    select: {
      id: true,
      phone_number: true,
      user: {
        select: {
          first_name: true,
          last_name: true,
          email: true
        }
      }
    }
  },
  
  room: {
    select: {
      id: true,
      room_number: true,
      room_type: {
        select: {
          name: true,
          base_price: true
        }
      }
    }
  },
  
  meal_plan: {
    select: {
      id: true,
      name: true,
      price_per_night: true
    }
  },
  
  invoice: {
    select: {
      id: true,
      status: true,
      items: {
        select: {
          description: true,
          total: true,
          quantity: true
        }
      },
      payments: {
        select: {
          amount: true,
          method: true,
          paid_at: true,
          status: true
        }
      }
    }
  }
};

const ERRORS = {
  ROOM_TYPE_NOT_FOUND:      { status: 404, message: "Room type not found" },
  GUEST_PROFILE_NOT_FOUND:  { status: 403, message: "User does not have a guest profile" },
  GUEST_PROFILE_INCOMPLETE: {
    status: 403,
    message: "Guest profile is incomplete. Please fill in phone number, passport number, and date of birth.",
  },
  NO_ROOMS_AVAILABLE:    { status: 409, message: "No rooms available for the selected dates" },
  CAPACITY_EXCEEDED:     { status: 400, message: "Number of guests exceeds room capacity" },
  MEAL_PLAN_NOT_FOUND:   { status: 404, message: "Meal plan not found or inactive" },
  RESERVATION_NOT_FOUND: { status: 404, message: "Reservation not found" },
  NOT_CONFIRMED:         { status: 400, message: "Reservation must be CONFIRMED to check in" },
  ALREADY_CHECKED_IN:    { status: 400, message: "Reservation is already checked in" },
  ALREADY_CHECKED_OUT:   { status: 400, message: "Reservation is already checked out" },
  NOT_CHECKED_IN:        { status: 400, message: "Reservation must be CHECKED_IN to check out" },
  INVOICE_NOT_FOUND:     { status: 404, message: "Invoice not found for this reservation" },
  CANNOT_NO_SHOW:        { status: 400, message: "Only CONFIRMED reservations can be marked as no-show" },
};

const calcNights = (checkIn: Date, checkOut: Date) =>
  Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

const calcChildrenDiscount = (roomCost: number, children: number) => {
  if (children === 0) return 0;
  const rate = Math.min(children * CHILD_DISCOUNT_RATE, 0.5);
  return Math.round(roomCost * rate * 100) / 100;
};

const resolveGuest = async (userId: number, requireComplete = false) => {
  const guest = await prisma.guest.findUnique({ where: { user_id: userId } });
  if (!guest) throw ERRORS.GUEST_PROFILE_NOT_FOUND;
  if (requireComplete && (!guest.phone_number || !guest.passport_number || !guest.date_of_birth))
    throw ERRORS.GUEST_PROFILE_INCOMPLETE;
  return guest;
};

const resolveMealPlan = async (meal_plan_id: number | null | undefined, nights: number) => {
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
  children,
  mealPlan,
  mealPlanCost,
  childrenDiscount,
  prepaidAmount,
  paymentMethod,
  meal_plan_id,
  check_in_date,
  check_out_date,
  adults,
}: BookingTxParams) => {
  const { nights, base_price, total_price: roomCost } = availability;

  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.create({
      data: {
        guest_id: guest.id,
        room_id: availability.room_id!,
        meal_plan_id: meal_plan_id ?? null,
        status: ReservationStatus.CONFIRMED,
        check_in_date,
        check_out_date,
        adults,
        children,
      },
    });

    const invoice = await InvoiceService.createInvoiceInTx({
      tx,
      reservation_id: reservation.id,
      check_in_date,
      nights,
      base_price,
      roomCost,
      mealPlan: mealPlan
        ? { name: mealPlan.name, price_per_night: Number(mealPlan.price_per_night) }
        : null,
      mealPlanCost,
      children,
      childrenDiscount,
    });

   
    await PaymentService.createPaymentInTx({
      tx,
      invoice_id: invoice.id,
      amount: prepaidAmount,
      method: paymentMethod as PaymentMethod,
    });

    return tx.reservation.findUnique({
      where: { id: reservation.id },
      select: reservationSelect,
    });
  });
};

export const ReservationService = {
  checkAvailability: async ({
    room_type_id,
    check_in_date,
    check_out_date,
  }: AvailabilityQuery) => {
    const roomType = await prisma.roomType.findUnique({ where: { id: room_type_id } });
    if (!roomType) throw ERRORS.ROOM_TYPE_NOT_FOUND;

    const occupied = await prisma.reservation.findMany({
      where: {
        room: { room_type_id },
        status: { notIn: [ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW] },
        check_in_date: { lt: check_out_date },
        check_out_date: { gt: check_in_date },
      },
      select: { room_id: true },
    });

    const availableRoom = await prisma.room.findFirst({
      where: {
        room_type_id,
        status: RoomStatus.AVAILABLE,
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

  
  createReservationAsGuest: async (input: CreateReservationInput, userId: number) => {
    const guest = await resolveGuest(userId, true);

    const availability = await ReservationService.checkAvailability(input);
    if (!availability.available || !availability.room_id) throw ERRORS.NO_ROOMS_AVAILABLE;
    if (input.adults + input.children > availability.max_occupancy) throw ERRORS.CAPACITY_EXCEEDED;

    const { cost: mealPlanCost, mealPlan } = await resolveMealPlan(
      input.meal_plan_id,
      availability.nights,
    );
    const childrenDiscount = calcChildrenDiscount(availability.total_price, input.children);
   
    const prepaidAmount = availability.total_price + mealPlanCost - childrenDiscount;

    return runBookingTransaction({
      guest,
      availability,
      children: input.children,
      mealPlan,
      mealPlanCost,
      childrenDiscount,
      prepaidAmount,
      paymentMethod: "CARD",
      meal_plan_id: input.meal_plan_id,
      check_in_date: input.check_in_date,
      check_out_date: input.check_out_date,
      adults: input.adults,
    });
  },

 
  checkin: async (reservationId: number, staffId: number) => {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) throw ERRORS.RESERVATION_NOT_FOUND;
    if (reservation.status === ReservationStatus.CHECKED_IN) throw ERRORS.ALREADY_CHECKED_IN;
    if (reservation.status !== ReservationStatus.CONFIRMED) throw ERRORS.NOT_CONFIRMED;

    return prisma.$transaction(async (tx) => {
      await tx.room.update({
        where: { id: reservation.room_id },
        data: { status: RoomStatus.OCCUPIED },
      });

      return tx.reservation.update({
        where: { id: reservationId },
        data: {
          status: ReservationStatus.CHECKED_IN,
          checked_in_at: new Date(),
          checked_in_by: staffId,
        },
        select: reservationSelect,
      });
    });
  },

  checkout: async (reservationId: number, { payment_method }: CheckoutInput, staffId: number) => {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        invoice: {
          include: { items: true, payments: true },
        },
      },
    });

    if (!reservation) throw ERRORS.RESERVATION_NOT_FOUND;
    if (reservation.status !== ReservationStatus.CHECKED_IN) throw ERRORS.NOT_CHECKED_IN;

    const invoice = reservation.invoice;
    if (!invoice) throw ERRORS.INVOICE_NOT_FOUND;

    
    const totalInvoice = invoice.items.reduce((sum, i) => sum + Number(i.total), 0);

    
    const totalPaid = invoice.payments
      .filter((p) => p.status === PaymentStatus.COMPLETED)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const remaining = Math.round((totalInvoice - totalPaid) * 100) / 100;

    return prisma.$transaction(async (tx) => {
      
      if (remaining > 0) {
        await PaymentService.createPaymentInTx({
          tx,
          invoice_id: invoice.id,
          amount: remaining,
          method: payment_method as PaymentMethod,
        });
      }

      await tx.invoice.update({
        where: { id: invoice.id },
        data: { status: InvoiceStatus.PAID },
      });

      
      await tx.room.update({
        where: { id: reservation.room_id },
        data: { status: RoomStatus.DIRTY },
      });

      return tx.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.CHECKED_OUT, checked_out_at: new Date(), checked_out_by: staffId },
        select: reservationSelect,
      });
    });
  },

  getById: async (reservationId: number) => {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      select: reservationSelect,
    });
    if (!reservation) throw ERRORS.RESERVATION_NOT_FOUND;
    return reservation;
  },

  getAll: async () => {
    return await prisma.reservation.findMany({
      select: reservationSelect,
      orderBy: {
        created_at: 'desc'
      }
    });
  },
  getTodaysCheckIns: async () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfToday.getDate() + 1);

    return await prisma.reservation.findMany({
      where: {
        check_in_date: {
          gte: startOfToday,
          lt: startOfTomorrow,
        },
        status: { in: [ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN, ReservationStatus.NO_SHOW] },
      },
      select: reservationSelect,
      orderBy: {
        created_at: "desc",
      },
    });
  },

  noShow: async (reservationId: number) => {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) throw ERRORS.RESERVATION_NOT_FOUND;
    if (reservation.status !== ReservationStatus.CONFIRMED) throw ERRORS.CANNOT_NO_SHOW;

    return prisma.$transaction(async (tx) => {
      await tx.room.update({
        where: { id: reservation.room_id },
        data: { status: RoomStatus.AVAILABLE },
      });

      return tx.reservation.update({
        where: { id: reservationId },
        data: { status: ReservationStatus.NO_SHOW },
        select: reservationSelect,
      });
    });
  },

  getTodaysCheckOuts: async () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfToday.getDate() + 1);

    return await prisma.reservation.findMany({
      where: {
        check_out_date: {
          gte: startOfToday,
          lt: startOfTomorrow,
        },
        status: { in: [ReservationStatus.CHECKED_IN, ReservationStatus.CHECKED_OUT] },
      },
      select: reservationSelect,
      orderBy: { created_at: "desc" },
    });
  },

  getMyReservations: async (userId: number) => {
    return await prisma.reservation.findMany({
      where: {
        guest: {
          user_id: userId, 
        },
      },
      select: reservationSelect,
      orderBy: {
        check_in_date: 'desc', 
      },
    });
  },
};