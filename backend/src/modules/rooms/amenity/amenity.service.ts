import { prisma } from "@lib/prisma.ts";
import { 
  CreateAmenityInput, 
  UpdateAmenityInput 
} from "./amenity.types";


const amenitySelect = { id: true, name: true, icon: true };

const AMENITY_ERRORS = {
  NOT_FOUND: "Amenity not found",
  DUPLICATE_NAME: (name: string) => `An amenity with the name '${name}' already exists`,
};

export const AmenityService = {
  
  getAll: async () => {
    return await prisma.amenity.findMany({
      orderBy: { name: "asc" },
      select: amenitySelect,
    });
  },

 
  getById: async (id: number) => {
    const amenity = await prisma.amenity.findUnique({
      where: { id },
      select: amenitySelect,
    });

    if (!amenity) throw new Error(AMENITY_ERRORS.NOT_FOUND);
    return amenity;
  },

  create: async (data: CreateAmenityInput) => {
    
    const existing = await prisma.amenity.findUnique({ 
      where: { name: data.name } 
    });
    
    if (existing) throw new Error(AMENITY_ERRORS.DUPLICATE_NAME(data.name));

    return await prisma.amenity.create({
      data,
      select: amenitySelect,
    });
  },

  update: async (id: number, data: UpdateAmenityInput) => {
   
    await AmenityService.getById(id);

    
    if (data.name) {
      const existing = await prisma.amenity.findFirst({
        where: { 
          name: data.name, 
          NOT: { id: id } 
        },
      });
      if (existing) throw new Error(AMENITY_ERRORS.DUPLICATE_NAME(data.name));
    }

    return await prisma.amenity.update({
      where: { id },
      data,
      select: amenitySelect,
    });
  },

  delete: async (id: number) => {
    
    const amenity = await AmenityService.getById(id);

    await prisma.amenity.delete({ where: { id } });

    return { 
      success: true,
      message: `Amenity '${amenity.name}' u fshi me sukses` 
    };
  },
};