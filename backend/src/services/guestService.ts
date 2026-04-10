import { prisma } from "../lib/prisma.ts";

/* =========================
   TYPES / DTO
========================= */

export interface UpdateGuestProfileDTO {
  phone_number?: string;
  address?: string;
  city?: string;
  country?: string;
  passport_number?: string;
  date_of_birth?: Date;
}

/* =========================
   SERVICE OBJECT
========================= */

export const GuestService = {
  getAllGuests: async () => {
    return prisma.guest.findMany({
      include: { user: true },
    });
  },

  getGuestById: async (id: number) => {
    const guest = await prisma.guest.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!guest) {
      throw { status: 404, message: "Guest not found" };
    }

    return guest;
  },

  updateGuestProfile: async (id: number, data: UpdateGuestProfileDTO) => {
    const guest = await prisma.guest.findUnique({
      where: { id },
    });

    if (!guest) {
      throw { status: 404, message: "Guest not found" };
    }

    return prisma.guest.update({
      where: { id },
      data: {
        ...(data.phone_number !== undefined && {
          phone_number: data.phone_number,
        }),
        ...(data.address !== undefined && {
          address: data.address,
        }),
        ...(data.city !== undefined && {
          city: data.city,
        }),
        ...(data.country !== undefined && {
          country: data.country,
        }),
        ...(data.passport_number !== undefined && {
          passport_number: data.passport_number,
        }),
        ...(data.date_of_birth !== undefined && {
          date_of_birth: data.date_of_birth,
        }),
      },
    });
  },
};
