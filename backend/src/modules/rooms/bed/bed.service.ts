import { prisma } from "@lib/prisma.ts";
import { CreateBedInput, UpdateBedInput } from "./bed.types.ts";

const bedSelect = { id: true, name: true, capacity: true };

const BED_ERRORS = {
  NOT_FOUND: { status: 404, message: "Bed not found" },
  DUPLICATE_NAME: (name: string) => ({
    status: 409,
    message: `A bed with the name '${name}' already exists`,
  }),
};

export const BedService = {
  getAll: async () => {
    return await prisma.bed.findMany({
      orderBy: { name: "asc" },
      select: bedSelect,
    });
  },

  getById: async (id: number) => {
    const bed = await prisma.bed.findUnique({
      where: { id },
      select: bedSelect,
    });

    if (!bed) throw BED_ERRORS.NOT_FOUND;
    return bed;
  },

  create: async (data: CreateBedInput) => {
    const existing = await prisma.bed.findUnique({
      where: { name: data.name },
    });

    if (existing) throw BED_ERRORS.DUPLICATE_NAME(data.name);

    return await prisma.bed.create({
      data,
      select: bedSelect,
    });
  },

  update: async (id: number, data: UpdateBedInput) => {
    await BedService.getById(id);

    if (data.name) {
      const existing = await prisma.bed.findFirst({
        where: { name: data.name, NOT: { id } },
      });
      if (existing) throw BED_ERRORS.DUPLICATE_NAME(data.name);
    }

    return await prisma.bed.update({
      where: { id },
      data,
      select: bedSelect,
    });
  },

  delete: async (id: number) => {
    await BedService.getById(id);
    await prisma.bed.delete({ where: { id } });
  },
};