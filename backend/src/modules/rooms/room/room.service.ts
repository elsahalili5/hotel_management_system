import { prisma } from "@lib/prisma.ts";
import { RoomStatus } from "@generated/prisma/enums.ts";
import {
  CreateRoomInput,
  UpdateRoomInput,
  UpdateRoomStatusInput,
  RoomId,
} from "./room.types.ts";
import { roomSelect } from "@lib/constants.ts";

const ROOM_ERRORS = {
  NOT_FOUND: { status: 404, message: "Room not found" },
  DUPLICATE_NUMBER: (room_number: string) => ({
    status: 409,
    message: `Room number '${room_number}' is already taken`,
  }),
};

export const RoomService = {
  getAll: async () => {
    return await prisma.room.findMany({
      orderBy: { room_number: "asc" },
      select: roomSelect,
    });
  },

  getById: async (id: RoomId) => {
    const room = await prisma.room.findUnique({
      where: { id },
      select: roomSelect,
    });

    if (!room) throw ROOM_ERRORS.NOT_FOUND;
    return room;
  },

  create: async (data: CreateRoomInput) => {
    const existing = await prisma.room.findUnique({
      where: { room_number: data.room_number },
    });

    if (existing) throw ROOM_ERRORS.DUPLICATE_NUMBER(data.room_number);

    return await prisma.room.create({
      data: {
        room_number: data.room_number,
        floor: data.floor,
        room_type_id: data.room_type_id,
        status: data.status ?? RoomStatus.AVAILABLE,
      },
      select: roomSelect,
    });
  },

  update: async (id: RoomId, data: UpdateRoomInput) => {
    await RoomService.getById(id);

    if (data.room_number) {
      const conflict = await prisma.room.findFirst({
        where: { room_number: data.room_number, NOT: { id } },
      });
      if (conflict) throw ROOM_ERRORS.DUPLICATE_NUMBER(data.room_number);
    }

    return await prisma.room.update({
      where: { id },
      data,
      select: roomSelect,
    });
  },

  updateStatus: async (id: RoomId, data: UpdateRoomStatusInput) => {
    await RoomService.getById(id);

    return await prisma.room.update({
      where: { id },
      data: { status: data.status },
      select: roomSelect,
    });
  },

  delete: async (id: RoomId) => {
    await RoomService.getById(id);
    await prisma.room.delete({ where: { id } });
  },

  getStats: async () => {
    const stats = await prisma.room.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    return stats.reduce((acc: Record<string, number>, curr) => {
      acc[curr.status] = curr._count._all;
      return acc;
    }, {});
  },
};
