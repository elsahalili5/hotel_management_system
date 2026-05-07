import { prisma } from "@lib/prisma.ts";
import { CreateExtraServiceInput, UpdateExtraServiceInput } from "./extraService.types.ts";

const throwError = (status: number, message: string): never => {
  throw { status, message };
};

export const ExtraServiceService = {
  getAllExtraServices: async () => {
    return prisma.extraService.findMany({
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: { name: "asc" },
    });
  },

  getExtraServiceById: async (id: number) => {
    const service = await prisma.extraService.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    if (!service) {
      throwError(404, "Extra service not found");
    }

    return service;
  },

  createExtraService: async (data: CreateExtraServiceInput) => {
    const category = await prisma.serviceCategory.findUnique({
      where: { id: data.category_id },
    });

    if (!category) {
      throwError(404, "Service category not found");
    }

    return prisma.extraService.create({
      data,
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });
  },

  updateExtraService: async (id: number, data: UpdateExtraServiceInput) => {
    const service = await prisma.extraService.findUnique({ where: { id } });

    if (!service) {
      throwError(404, "Extra service not found");
    }

    if (data.category_id) {
      const category = await prisma.serviceCategory.findUnique({
        where: { id: data.category_id },
      });
      if (!category) {
        throwError(404, "Service category not found");
      }
    }

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    return prisma.extraService.update({
      where: { id },
      data: cleanData,
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });
  },

  deleteExtraService: async (id: number) => {
    const service = await prisma.extraService.findUnique({ where: { id } });

    if (!service) {
      throwError(404, "Extra service not found");
    }

    await prisma.extraService.delete({ where: { id } });
  },
};
