import { prisma } from "@lib/prisma.ts";
import { CreateServiceCategoryInput, UpdateServiceCategoryInput } from "./serviceCategory.types.ts";

const ERRORS = {
  NOT_FOUND: { status: 404, message: "Service category not found" },
  DUPLICATE_NAME: (name: string) => ({
    status: 409,
    message: `A service category with the name '${name}' already exists`,
  }),
};

const categorySelect = {
  id: true,
  name: true,
  description: true,
  sort_order: true,
  is_active: true,
  _count: { select: { services: true } },
};

export const ServiceCategoryService = {
  getAll: async () => {
    return await prisma.serviceCategory.findMany({
      orderBy: { sort_order: "asc" },
      select: categorySelect,
    });
  },

  getById: async (id: number) => {
    const category = await prisma.serviceCategory.findUnique({ where: { id }, select: categorySelect });
    if (!category) throw ERRORS.NOT_FOUND;
    return category;
  },

  create: async (data: CreateServiceCategoryInput) => {
    const existing = await prisma.serviceCategory.findUnique({ where: { name: data.name } });
    if (existing) throw ERRORS.DUPLICATE_NAME(data.name);
    return await prisma.serviceCategory.create({ data, select: categorySelect });
  },

  update: async (id: number, data: UpdateServiceCategoryInput) => {
    await ServiceCategoryService.getById(id);
    if (data.name) {
      const existing = await prisma.serviceCategory.findFirst({ where: { name: data.name, NOT: { id } } });
      if (existing) throw ERRORS.DUPLICATE_NAME(data.name);
    }
    return await prisma.serviceCategory.update({ where: { id }, data, select: categorySelect });
  },

  delete: async (id: number) => {
    await ServiceCategoryService.getById(id);
    await prisma.serviceCategory.delete({ where: { id } });
  },
};