import { prisma } from "@lib/prisma.ts";
import { AvailabilityQuery } from "./reservation.types.ts";

const ERRORS = {
  ROOM_TYPE_NOT_FOUND: { status: 404, message: "Room type not found" },
};

export const ReservationService = {
  checkAvailability: async ({ room_type_id, check_in_date, check_out_date }: AvailabilityQuery) => {
    const roomType = await prisma.roomType.findUnique({ where: { id: room_type_id } });
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

    const nights = Math.ceil(
      (check_out_date.getTime() - check_in_date.getTime()) / (1000 * 60 * 60 * 24),
    );

    return {
      available: Boolean(availableRoom),
      room_id: availableRoom?.id,
      room_type_id,
      check_in_date,
      check_out_date,
      nights,
      base_price: Number(roomType.base_price),
      total_price: Number(roomType.base_price) * nights,
    };
  },
};