import { prisma } from "../../lib/prisma.ts";
import { RoomStatus } from "../../generated/prisma/enums.ts";

export const RoomService = {
  createRoom: async (data: { room_number: string; floor: number; room_type_id: number }) => {
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
    return await prisma.room.update({
      where: { id },
      data,
      include: { room_type: true }
    });
  },

  deleteRoom: async (id: number) => {
    return await prisma.room.delete({
      where: { id }
    });
  },

  updateRoomStatus: async (id: number, status: RoomStatus) => {
    return await prisma.room.update({
      where: { id },
      data: { status }
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
      where: { status: 'AVAILABLE', room_type_id: typeId },
      include: { room_type: true }
    });
  },
};




