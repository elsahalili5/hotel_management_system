import { prisma } from "../../lib/prisma.ts";

export const AmenityService = {
  getAllAmenities: async () => {
    return await prisma.amenity.findMany({
      orderBy: { name: 'asc' }
    });
  },

  getAmenityById: async (id: number) => {
    return await prisma.amenity.findUnique({ where: { id } });
  },

  createNewAmenity: async (name: string, icon?: string) => {
    const existing = await prisma.amenity.findUnique({ where: { name } });
    if (existing) {
      throw { status: 409, message: `An amenity with the name '${name}' already exists` };
    }

    return await prisma.amenity.create({
      data: { name, icon }
    });
  },

  updateAmenity: async (id: number, name: string, icon?: string) => {
    try {
      return await prisma.amenity.update({
        where: { id },
        data: { name, icon }
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw { status: 409, message: "An amenity with this name already exists" };
      }
      throw error;
    }
  },

  removeAmenity: async (id: number) => {
    return await prisma.amenity.delete({
      where: { id }
    });
  },
};