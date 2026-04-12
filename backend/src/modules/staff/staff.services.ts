import { prisma } from "@lib/prisma.ts";
import { Shift } from "@generated/prisma/client.ts";

interface UpdateStaffProfilePayload {
  phone_number?: string;
  shift?: Shift;
  is_active?: boolean;
}

export const StaffService = {
  getAllStaff: async () => {
    return prisma.staff.findMany({
      include: { user: true },
    });
  },

  getStaffById: async (id: number) => {
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!staff) {
      throw { status: 404, message: "Staff not found" };
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
      throw { status: 404, message: "Staff not found" };
    }

    if (!payload || Object.keys(payload).length === 0) {
      throw { status: 400, message: "No fields provided to update" };
    }

    const cleanData = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null),
    );

    if (
      cleanData.shift &&
      !Object.values(Shift).includes(cleanData.shift as Shift)
    ) {
      throw { status: 400, message: "Invalid shift value" };
    }

    return prisma.staff.update({
      where: { id },
      data: cleanData,
      include: { user: true },
    });
  },
};
