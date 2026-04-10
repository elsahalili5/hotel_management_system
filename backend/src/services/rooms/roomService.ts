import { prisma } from "../../lib/prisma.ts";
import { RoomStatus } from "../../generated/prisma/enums.ts";



export const createRoom = async (data: { room_number: string; floor: number; room_type_id: number }) => {
  return await prisma.room.create({
    data: {
      ...data,
      status: RoomStatus.AVAILABLE 
    },
    include: { room_type: true }
  });
};


export const getAllRooms = async (filters?: any) => {
  return await prisma.room.findMany({
    where: filters,
    include: { room_type: true },
    orderBy: { room_number: 'asc' } 
  });
};

export const getRoomById = async (id: number) => {
  return await prisma.room.findUnique({
    where: { id },
    include: { room_type: true }
  });
};


export const updateRoom = async (id: number, data: any) => {
  return await prisma.room.update({
    where: { id },
    data,
    include: { room_type: true }
  });
};


export const deleteRoom = async (id: number) => {
  return await prisma.room.delete({
    where: { id }
  });
};


export const updateRoomStatus = async (id: number, status: RoomStatus) => {
  return await prisma.room.update({
    where: { id },
    data: { status }
  });
};

export const getRoomStats = async () => {
  const stats = await prisma.room.groupBy({
    by: ['status'],
    _count: { status: true }
  });

  
  const formattedStats = stats.reduce((acc: any, curr) => {
    acc[curr.status] = curr._count.status;
    return acc;
  }, {});

  return formattedStats;
};


export const getAvailableRooms = async (typeId?: number) => {
  return await prisma.room.findMany({
    where: { status: 'AVAILABLE', room_type_id: typeId },
    include: { room_type: true }
  });
};




