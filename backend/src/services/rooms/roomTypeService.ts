import { prisma } from "../../lib/prisma.ts";

//Fetch all room types with their full relations

export const getAllRoomTypes = async () => {
  return await prisma.roomType.findMany({
    include: {
      amenities: {
        include: { amenity: true },
      },
      beds: {
        include: { bed: true },
      },
      images: true,
      _count: {
        select: { rooms: true },
      },
    },
  });
};

//get a single room type by ID
export const getRoomTypeById = async (id: number) => {
  return await prisma.roomType.findUnique({
    where: { id },
    include: {
      amenities: { include: { amenity: true } },
      beds: { include: { bed: true } },
      images: true,
    },
  });
};

// Create a  Room Type with its relations

export const createRoomType = async (data: {
  name: string;
  description?: string;
  base_price: number;
  max_occupancy: number;
  size_m2?: number;
  amenities?: number[];
  beds?: { bed_id: number; quantity: number }[];
  images?: { url: string; is_primary?: boolean; alt_text?: string }[];
}) => {
  return await prisma.roomType.create({
    data: {
      name: data.name,
      description: data.description,
      base_price: data.base_price,
      max_occupancy: data.max_occupancy,
      size_m2: data.size_m2,
      amenities: {
        create: data.amenities?.map((id) => ({
          amenity: { connect: { id } },
        })),
      },
      beds: {
        create: data.beds?.map((b) => ({
          bed: { connect: { id: b.bed_id } },
          quantity: b.quantity,
        })),
      },
      images: {
        create: data.images?.map((img) => ({
          url: img.url,
          is_primary: img.is_primary || false,
          alt_text: img.alt_text,
        })),
      },
    },
    include: {
      amenities: { include: { amenity: true } },
      beds: { include: { bed: true } },
      images: true,
    },
  });
};

// Update a room type and synchronize its relations

export const updateRoomType = async (id: number, data: any) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Fshijmë lidhjet e vjetra në tabelat ndërmjetëse
    if (data.amenities) {
      await tx.roomTypeAmenity.deleteMany({ where: { room_type_id: id } });
    }
    if (data.beds) {
      await tx.roomTypeBed.deleteMany({ where: { room_type_id: id } });
    }
    if (data.images) {
      await tx.roomImage.deleteMany({ where: { room_type_id: id } });
    }

    // 2. Përditësojmë RoomType dhe krijojmë lidhjet e reja
    return await tx.roomType.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        base_price: data.base_price ? Number(data.base_price) : undefined,
        max_occupancy: data.max_occupancy
          ? Number(data.max_occupancy)
          : undefined,
        size_m2: data.size_m2 ? Number(data.size_m2) : undefined,

        amenities: data.amenities
          ? {
              create: data.amenities.map((amenityId: number) => ({
                amenity: { connect: { id: Number(amenityId) } },
              })),
            }
          : undefined,

        beds: data.beds
          ? {
              create: data.beds.map((b: any) => ({
                bed: { connect: { id: Number(b.bed_id) } },
                quantity: Number(b.quantity),
              })),
            }
          : undefined,

        images: data.images
          ? {
              create: data.images.map((img: any) => ({
                url: img.url,
                is_primary: img.is_primary || false,
                alt_text: img.alt_text,
              })),
            }
          : undefined,
      },
      include: {
        amenities: { include: { amenity: true } },
        beds: { include: { bed: true } },
        images: true,
      },
    });
  });
};

// Remove a room type

export const removeRoomType = async (id: number) => {
  return await prisma.roomType.delete({
    where: { id },
  });
};
