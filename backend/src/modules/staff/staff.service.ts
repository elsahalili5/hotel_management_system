import { prisma } from "@lib/prisma.ts";
import { UpdateStaffInput } from "./staff.types";

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

  updateStaffProfile: async (id: number, payload: UpdateStaffInput) => {
    const staff = await prisma.staff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw { status: 404, message: "Staff not found" };
    }

    const cleanData = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null),
    );

    if (Object.keys(cleanData).length === 0) {
      throw { status: 400, message: "No fields provided to update" };
    }

    return prisma.staff.update({
      where: { id },
      data: cleanData,
      include: { user: true },
    });
  },
};
