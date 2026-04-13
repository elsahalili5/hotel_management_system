import { prisma } from "@lib/prisma.ts";
import { 
  CreateBedInput, 
  UpdateBedInput, 
  BedId 
} from "./bed.types";

const bedSelect = { id: true, name: true, capacity: true };

const BED_ERRORS = {
  NOT_FOUND: "Bed not found",
  DUPLICATE_NAME: (name: string) => `A bed with the name '${name}' already exists`,
};

export const BedService = {
  
  getAll: async () => {
    return await prisma.bed.findMany({
      orderBy: { name: "asc" },
      select: bedSelect,
    });
  },

  getById: async (id: BedId) => {
    const bed = await prisma.bed.findUnique({
      where: { id },
      select: bedSelect,
    });

    if (!bed) {
      const error: any = new Error(BED_ERRORS.NOT_FOUND);
      error.status = 404; 
      throw error;
    }
    return bed;
  },

  create: async (data: CreateBedInput) => {
    const existing = await prisma.bed.findUnique({ 
      where: { name: data.name } 
    });
    
   if (existing) {
      const error: any = new Error(BED_ERRORS.DUPLICATE_NAME(data.name));
      error.status = 409;
      throw error;
    }

    return await prisma.bed.create({
      data,
      select: bedSelect,
    });
  },

  update: async (id: BedId, data: UpdateBedInput) => {
    
    await BedService.getById(id);

    if (data.name) {
      const existing = await prisma.bed.findFirst({
        where: { 
          name: data.name, 
          NOT: { id } 
        },
      });
     if (existing) {
      const error: any = new Error(BED_ERRORS.DUPLICATE_NAME(data.name));
      error.status = 409; 
      throw error;
    }
    }

    return await prisma.bed.update({
      where: { id },
      data,
      select: bedSelect,
    });
  },

  delete: async (id: BedId) => {
    const bed = await BedService.getById(id);

    await prisma.bed.delete({ where: { id } });

    return { 
      success: true,
      message: `Bed '${bed.name}' was deleted successfully.` 
    };
  },
};