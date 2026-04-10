import { prisma } from "../../lib/prisma.ts";

export const BedService = {
  getAllBeds: async () => {
    return await prisma.bed.findMany();
  },

  createNewBed: async (name: string, capacity: number) => {
    return await prisma.bed.create({
      data: { name, capacity }
    });
  },

  updateBed: async (id: number, name: string, capacity: number) => {
    return await prisma.bed.update({
      where: { id },
      data: { name, capacity }
    });
  },

  removeBed: async (id: number) => {
    return await prisma.bed.delete({
      where: { id }
    });
  },
};