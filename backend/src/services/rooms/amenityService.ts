import { prisma } from "../../lib/prisma.ts";

export const AmenityService = {
  getAllAmenities: async () => {
    return await prisma.amenity.findMany({
      orderBy: { name: 'asc' }
    });
  },

  createNewAmenity: async (name: string, icon?: string) => {
    return await prisma.amenity.create({
      data: { name, icon }
    });
  },

  updateAmenity: async (id: number, name: string, icon?: string) => {
    return await prisma.amenity.update({
      where: { id },
      data: { name, icon }
    });
  },

  removeAmenity: async (id: number) => {
    return await prisma.amenity.delete({
      where: { id }
    });
  },
};