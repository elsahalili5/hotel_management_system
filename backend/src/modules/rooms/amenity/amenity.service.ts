import { prisma } from "@lib/prisma.ts";
import { CreateAmenityInput, UpdateAmenityInput, AmenityId } from "./amenity.types.ts";

const amenitySelect = { id: true, name: true, icon: true };

const AMENITY_ERRORS = {
  NOT_FOUND: { status: 404, message: "Amenity not found" },
  DUPLICATE_NAME: (name: string) => ({
    status: 409,
    message: `An amenity with the name '${name}' already exists`,
  }),
};

export const AmenityService = {
  getAll: async () => {
    return await prisma.amenity.findMany({
      orderBy: { name: "asc" },
      select: amenitySelect,
    });
  },

  getById: async (id: AmenityId) => {
    const amenity = await prisma.amenity.findUnique({
      where: { id },
      select: amenitySelect,
    });

    if (!amenity) throw AMENITY_ERRORS.NOT_FOUND;
    return amenity;
  },

  create: async (data: CreateAmenityInput) => {
    const existing = await prisma.amenity.findUnique({
      where: { name: data.name },
    });

    if (existing) throw AMENITY_ERRORS.DUPLICATE_NAME(data.name);

    return await prisma.amenity.create({
      data,
      select: amenitySelect,
    });
  },

  update: async (id: AmenityId, data: UpdateAmenityInput) => {
    await AmenityService.getById(id);

    if (data.name) {
      const existing = await prisma.amenity.findFirst({
        where: { name: data.name, NOT: { id } },
      });
      if (existing) throw AMENITY_ERRORS.DUPLICATE_NAME(data.name);
    }

    return await prisma.amenity.update({
      where: { id },
      data,
      select: amenitySelect,
    });
  },

  delete: async (id: AmenityId) => {
    await AmenityService.getById(id);
    await prisma.amenity.delete({ where: { id } });
  },
};