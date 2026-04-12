import { prisma } from "../lib/prisma.ts";
import { Prisma } from "@prisma/client";

export interface UpdateGuestProfileDTO {
  phone_number?: string;
  address?: string;
  city?: string;
  country?: string;
  passport_number?: string;
  date_of_birth?: Date;
}

const safeUserSelect = {
  id: true,
  first_name: true,
  last_name: true,
  email: true,
  status: true,
  email_confirmed: true,
  role: true,
};

export const GuestService = {
  getAllGuests: async () => {
    return prisma.guest.findMany({
      include: {
        user: {
          select: safeUserSelect, // ❌ fsheh password_hash
        },
      },
    });
  },

  getGuestById: async (id: number) => {
    const guest = await prisma.guest.findUnique({
      where: { id },
      include: {
        user: {
          select: safeUserSelect, // ❌ fsheh password_hash
        },
      },
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

    try {
      const updatedGuest = await prisma.guest.update({
        where: { id },
        data: cleanData,
        include: {
          user: {
            select: safeUserSelect, // ❌ konsistent response
          },
        },
      });

      return updatedGuest;
    } catch (error: any) {
      // ❌ handle Prisma unique constraint error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw {
            status: 409,
            message: `Duplicate value for: ${error.meta?.target}`,
          };
        }
      }

      throw error;
    }
  },
};
