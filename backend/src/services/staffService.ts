import { prisma } from "../lib/prisma.ts";
import { Shift } from "../generated/prisma/client.ts";

interface UpdateStaffProfilePayload {
  phone_number?: string;
  shift?: Shift;
  is_active?: boolean;
}

export const StaffService = {
  getAllStaff: async () => {
    return await prisma.staff.findMany({
      include: {
        user: true,
      },
    });
  },

  getStaffById: async (id: number) => {
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!staff) {
      throw {
        status: 404,
        message: "Staff not found",
      };
    }

    return staff;
  },

  updateStaffProfile: async (
    id: number,
    payload: UpdateStaffProfilePayload,
  ) => {
    const staff = await prisma.staff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw {
        status: 404,
        message: "Staff not found",
      };
    }

    return await prisma.staff.update({
      where: { id },
      data: {
        ...(payload.phone_number !== undefined && {
          phone_number: payload.phone_number,
        }),

        ...(payload.shift !== undefined && {
          shift: payload.shift,
        }),

        ...(payload.is_active !== undefined && {
          is_active: payload.is_active,
        }),
      },
    });
  },
};
