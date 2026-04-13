import { prisma } from "@lib/prisma.ts";
import { CreateRoomTypeInput, UpdateRoomTypeInput, RoomTypeId } from "./roomType.types.ts";

const roomTypeInclude = {
  amenities: { select: { amenity: true } },
  beds: { select: { bed: true, quantity: true } },
  images: true,
  _count: { select: { rooms: true } },
};

const ROOM_TYPE_ERRORS = {
  NOT_FOUND: { status: 404, message: "Room Type not found" },
  DUPLICATE_NAME: (name: string) => ({
    status: 409,
    message: `A Room Type with the name '${name}' already exists`,
  }),
  INSUFFICIENT_CAPACITY: (bedCap: number, maxOcc: number) => ({
    status: 400,
    message: `Total bed capacity (${bedCap}) is insufficient for max occupancy (${maxOcc})`,
  }),
  HAS_ROOMS: (count: number) => ({
    status: 409,
    message: `Cannot delete Room Type. There are ${count} rooms associated with it. Please delete or reassign the rooms first`,
  }),
};

export const RoomTypeService = {
  getAll: async () => {
    return await prisma.roomType.findMany({
      orderBy: { name: "asc" },
      include: roomTypeInclude,
    });
  },

  getById: async (id: RoomTypeId) => {
    const roomType = await prisma.roomType.findUnique({
      where: { id },
      include: roomTypeInclude,
    });

    if (!roomType) throw ROOM_TYPE_ERRORS.NOT_FOUND;
    return roomType;
  },

  create: async (data: CreateRoomTypeInput) => {
    const existing = await prisma.roomType.findUnique({ where: { name: data.name } });
    if (existing) throw ROOM_TYPE_ERRORS.DUPLICATE_NAME(data.name);

    if (data.beds && data.beds.length > 0) {
      const bedDetails = await prisma.bed.findMany({
        where: { id: { in: data.beds.map((b) => b.bed_id) } },
      });

      const totalCap = data.beds.reduce((sum, b) => {
        const bedInfo = bedDetails.find((bd) => bd.id === b.bed_id);
        return sum + (bedInfo ? bedInfo.capacity * b.quantity : 0);
      }, 0);

      if (totalCap < data.max_occupancy) {
        throw ROOM_TYPE_ERRORS.INSUFFICIENT_CAPACITY(totalCap, data.max_occupancy);
      }
    }

    return await prisma.roomType.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        base_price: data.base_price,
        max_occupancy: data.max_occupancy,
        size_m2: data.size_m2 ?? null,

        amenities: data.amenities ? {
          create: data.amenities.map((id) => ({
            amenity: { connect: { id } },
          })),
        } : undefined,

        beds: data.beds ? {
          create: data.beds.map((b) => ({
            bed: { connect: { id: b.bed_id } },
            quantity: b.quantity,
          })),
        } : undefined,

        images: data.images ? {
          create: data.images.map((img) => ({
            url: img.url,
            is_primary: img.is_primary || false,
            alt_text: img.alt_text ?? null,
          })),
        } : undefined,
      },
      include: roomTypeInclude,
    });
  },

  update: async (id: RoomTypeId, data: UpdateRoomTypeInput) => {
    const current = await RoomTypeService.getById(id);

    if (data.name && data.name !== current.name) {
      const existing = await prisma.roomType.findUnique({ where: { name: data.name } });
      if (existing) throw ROOM_TYPE_ERRORS.DUPLICATE_NAME(data.name);
    }

    const finalMaxOccupancy = data.max_occupancy ?? current.max_occupancy;
    const finalBeds = data.beds ?? current.beds.map((b) => ({
      bed_id: b.bed.id,
      quantity: b.quantity,
    }));

    if (data.beds || data.max_occupancy) {
      const bedDetails = await prisma.bed.findMany({
        where: { id: { in: finalBeds.map((b) => b.bed_id) } },
      });

      const totalCap = finalBeds.reduce((sum, b) => {
        const bedInfo = bedDetails.find((bd) => bd.id === b.bed_id);
        return sum + (bedInfo ? bedInfo.capacity * b.quantity : 0);
      }, 0);

      if (totalCap < finalMaxOccupancy) {
        throw ROOM_TYPE_ERRORS.INSUFFICIENT_CAPACITY(totalCap, finalMaxOccupancy);
      }
    }

    return await prisma.$transaction(async (tx) => {
      if (data.amenities) await tx.roomTypeAmenity.deleteMany({ where: { room_type_id: id } });
      if (data.beds) await tx.roomTypeBed.deleteMany({ where: { room_type_id: id } });
      if (data.images) await tx.roomImage.deleteMany({ where: { room_type_id: id } });

      return await tx.roomType.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          base_price: data.base_price,
          max_occupancy: data.max_occupancy,
          size_m2: data.size_m2,

          amenities: data.amenities ? {
            create: data.amenities.map((aId) => ({
              amenity: { connect: { id: aId } },
            })),
          } : undefined,

          beds: data.beds ? {
            create: data.beds.map((b) => ({
              bed: { connect: { id: b.bed_id } },
              quantity: b.quantity,
            })),
          } : undefined,

          images: data.images ? {
            create: data.images.map((img) => ({
              url: img.url,
              is_primary: img.is_primary,
              alt_text: img.alt_text,
            })),
          } : undefined,
        },
        include: roomTypeInclude,
      });
    });
  },

  delete: async (id: RoomTypeId) => {
    const roomType = await RoomTypeService.getById(id);

    if (roomType._count.rooms > 0) {
      throw ROOM_TYPE_ERRORS.HAS_ROOMS(roomType._count.rooms);
    }

    await prisma.roomType.delete({ where: { id } });
  },
};