import { prisma } from "../../lib/prisma.ts";
import { Prisma } from "@prisma/client";
import { UpdateGuestInput } from "./guest.types";

const throwError = (status: number, message: string): never => {
  throw { status, message };
};

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
          select: safeUserSelect,
        },
      },
    });
  },

  // ---------------- GET BY ID ----------------
  getGuestById: async (id: number) => {
    const guest = await prisma.guest.findUnique({
      where: { id },
      include: {
        user: {
          select: safeUserSelect,
        },
      },
    });

    if (!guest) {
      throwError(404, "Guest not found");
    }

    return guest;
  },

  updateGuestProfile: async (id: number, data: UpdateGuestInput) => {
    const guest = await prisma.guest.findUnique({
      where: { id },
    });

    if (!guest) {
      throwError(404, "Guest not found");
    }

    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    if (Object.keys(cleanData).length === 0) {
      throwError(400, "No fields provided to update");
    }

    try {
      return await prisma.guest.update({
        where: { id },
        data: cleanData,
        include: {
          user: {
            select: safeUserSelect,
          },
        },
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throwError(409, `Duplicate value for: ${error.meta?.target}`);
        }
      }

      throw error;
    }
  },
};
