import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcrypt";
import { Shift } from "../generated/prisma/client.ts";

export const getAllStaffService = async () => {
  return prisma.staff.findMany({ include: { user: true } });
};

export const getStaffByIdService = async (id: number) => {
  const staff = await prisma.staff.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!staff) throw { status: 404, message: "Staff not found" };
  return staff;
};
export const updateStaffProfile = async (
  id: number,
  phone_number: string,
  shift: Shift,
  is_active: boolean,
) => {
  return await prisma.staff.update({
    where: { id },
    data: {
      phone_number,
      shift,
      is_active,
    },
  });
};
