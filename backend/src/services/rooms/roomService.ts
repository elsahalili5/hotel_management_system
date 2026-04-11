import { prisma } from "../../lib/prisma.ts";
import { RoomStatus } from "../../generated/prisma/enums.ts";

export const RoomService = {
  createRoom: async (data: { room_number: string; floor: number; room_type_id: number }) => {
    const existing = await prisma.room.findUnique({ where: { room_number: data.room_number } });
    if (existing) {
      throw { status: 409, message: `Room number '${data.room_number}' already exists` };
    }

    const roomTypeExists = await prisma.roomType.findUnique({ where: { id: data.room_type_id } });
    if (!roomTypeExists) {
      throw { status: 404, message: `Room type with ID ${data.room_type_id} does not exist` };
    }

    return await prisma.room.create({
      data: {
        ...data,
        status: RoomStatus.AVAILABLE
      },
      include: { room_type: true }
    });
  },

  getAllRooms: async (filters?: any) => {
    return await prisma.room.findMany({
      where: filters,
      include: { room_type: true },
      orderBy: { room_number: 'asc' }
    });
  },

  getRoomById: async (id: number) => {
    return await prisma.room.findUnique({
      where: { id },
      include: { room_type: true }
    });
  },

  updateRoom: async (id: number, data: any) => {
    const existing = await prisma.room.findUnique({ where: { id } });
    if (!existing) {
      throw { status: 404, message: "Room does not exist" };
    }

    return await prisma.room.update({
      where: { id },
      data,
      include: { room_type: true }
    });
  },

  deleteRoom: async (id: number) => {
    const existing = await prisma.room.findUnique({ where: { id } });
    if (!existing) {
      throw { status: 404, message: "Room was not found" };
    }

    return await prisma.room.delete({
      where: { id }
    });
  },

  updateRoomStatus: async (id: number, status: RoomStatus) => {
    const existing = await prisma.room.findUnique({ where: { id } });
    if (!existing) {
      throw { status: 404, message: "Room was not found" };
    }

    return await prisma.room.update({
      where: { id },
      data: { status },
      include: { room_type: true }
    });
  },

  getRoomStats: async () => {
    const stats = await prisma.room.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    return stats.reduce((acc: any, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {});
  },

  getAvailableRooms: async (typeId?: number) => {
    return await prisma.room.findMany({
      where: { status: RoomStatus.AVAILABLE, room_type_id: typeId },
      include: { room_type: true }
    });
  },
};




