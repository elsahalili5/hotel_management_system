import { prisma } from "../../lib/prisma.ts";

export const getAllAmenities = async () => {
  return await prisma.amenity.findMany({
    orderBy: { name: 'asc' }
  });
};

export const createNewAmenity = async (name: string, icon?: string) => {
  return await prisma.amenity.create({
    data: { name, icon }
  });
};
export const updateAmenity = async (id: number, name: string, icon?: string) => {
  return await prisma.amenity.update({
    where: { id },
    data: { name, icon }
  });
};
export const removeAmenity = async (id: number) => {
  return await prisma.amenity.delete({
    where: { id }
  });
};