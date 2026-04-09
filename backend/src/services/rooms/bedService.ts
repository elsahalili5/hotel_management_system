import { prisma } from "../../lib/prisma.ts";

// Get all bed types
export const getAllBeds = async () => {
  return await prisma.bed.findMany();
};

// Create a new bed type (e.g., King Size, capacity: 2)
export const createNewBed = async (name: string, capacity: number) => {
  return await prisma.bed.create({
    data: { name, capacity }
  });
};

// Update bed info
export const updateBed = async (id: number, name: string, capacity: number) => {
  return await prisma.bed.update({
    where: { id },
    data: { name, capacity }
  });
};

// Remove a bed type
export const removeBed = async (id: number) => {
  return await prisma.bed.delete({
    where: { id }
  });
};