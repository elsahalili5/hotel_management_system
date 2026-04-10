// guestService.ts
import { prisma } from "../lib/prisma.ts";

export const getAllGuestsService = async () => {
  return prisma.guest.findMany({ include: { user: true } });
};

export const getGuestByIdService = async (id: number) => {
  const guest = await prisma.guest.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!guest) throw { status: 404, message: "Guest not found" };
  return guest;
};
export const updateGuestProfile = async (
  id: number,
  phone_number?: string,
  address?: string,
  city?: string,
  country?: string,
  passport_number?: string,
  date_of_birth?: Date | null,
) => {
  return await prisma.guest.update({
    where: { id },
    data: {
      ...(phone_number !== undefined && { phone_number }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(country !== undefined && { country }),
      ...(passport_number !== undefined && { passport_number }),
      ...(date_of_birth !== undefined && { date_of_birth }),
    },
  });
};
