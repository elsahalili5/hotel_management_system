import { prisma } from "../../lib/prisma.ts";
import { Prisma } from "@generated/prisma/client.ts";
import { UpdateGuestInput, GuestIdParam } from "./guest.types";
import { safeUserSelect } from "@lib/constants.ts";

const throwError = (status: number, message: string): never => {
  throw { status, message };
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

  updateGuestProfile: async (
    id: number,
    data: UpdateGuestInput,
    requestingUserId?: number,
  ) => {
    const guest = await prisma.guest.findUnique({
      where: { id },
    });

    if (!guest) {
      throwError(404, "Guest not found");
    }

    if (requestingUserId !== undefined && guest!.user_id !== requestingUserId) {
      throwError(403, "Forbidden: You can only update your own profile");
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
