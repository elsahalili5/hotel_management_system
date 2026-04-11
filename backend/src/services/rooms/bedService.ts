import { prisma } from "../../lib/prisma.ts";

export const BedService = {
  getAllBeds: async () => {
    return await prisma.bed.findMany({
      orderBy: { name: 'asc' }
    });
  },

  getBedById: async (id: number) => {
    return await prisma.bed.findUnique({ where: { id } });
  },

  createNewBed: async (name: string, capacity: number) => {
    const existing = await prisma.bed.findUnique({ where: { name } });
    if (existing) {
      throw { status: 409, message: `A bed with the name '${name}' already exists` };
    }

    return await prisma.bed.create({
      data: { name, capacity }
    });
  },

  updateBed: async (id: number, name: string, capacity: number) => {
    const existing = await prisma.bed.findUnique({ where: { name } });
    if (existing && existing.id !== id) {
      throw { status: 409, message: `A bed with the name '${name}' already exists` };
    }

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