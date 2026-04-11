import { prisma } from "../lib/prisma.ts";

export interface UpdateGuestProfileDTO {
  phone_number?: string;
  address?: string;
  city?: string;
  country?: string;
  passport_number?: string;
  date_of_birth?: Date;
}

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

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    return prisma.guest.update({
      where: { id },
      data: cleanData,
    });
  },
};
