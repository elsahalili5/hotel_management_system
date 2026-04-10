import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcrypt";

export const createGuest = async (data: any) => {
  try {
    const password_hash = await bcrypt.hash(data.password, 10);

    const guest = await prisma.guest.create({
      data: {
        phone_number: data.phone_number,
        address: data.address,
        city: data.city,
        country: data.country,
        passport_number: data.passport_number,
        date_of_birth: data.date_of_birth,

        user: {
          create: {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password_hash,
          },
        },
      },

      include: {
        user: true,
      },
    });

    return guest;
  } catch (error) {
    console.log(error);

    throw {
      status: 500,
      message: "Failed to create guest",
    };
  }
};

const ALLOWED_STAFF_ROLES = [
  "MANAGER",
  "RECEPTIONIST",
  "HOUSEKEEPING",
] as const;
export const createStaff = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: "MANAGER" | "RECEPTIONIST" | "HOUSEKEEPING";
  phone_number?: string;
  shift?: "MORNING" | "AFTERNOON" | "NIGHT";
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw { status: 400, message: "User already exists" };
  }

  if (!ALLOWED_STAFF_ROLES.includes(data.role)) {
    throw { status: 400, message: "Invalid staff role" };
  }

  const role = await prisma.role.findUnique({
    where: { name: data.role },
  });

  if (!role) {
    throw { status: 404, message: "Role not found" };
  }

  const password_hash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password_hash,
      status: "ACTIVE",

      user_roles: {
        create: {
          role_id: role.id,
        },
      },

      staff_profile: {
        create: {
          phone_number: data.phone_number ?? null,
          shift: data.shift ?? "MORNING",
        },
      },
    },

    include: {
      user_roles: { include: { role: true } },
      staff_profile: true,
    },
  });

  return user;
};
export const getAllUsersService = async () => {
  return prisma.user.findMany({
    include: {
      user_roles: { include: { role: true } },
      guest_profile: true,
      staff_profile: true,
    },
  });
};

export const getUserByIdService = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      user_roles: { include: { role: true } },
      guest_profile: true,
      staff_profile: true,
    },
  });

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return user;
};

export const updateUserService = async (userId: number, updateData: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw { status: 404, message: "User not found" };
  }

  const data: any = {};

  if (updateData.first_name) {
    data.first_name = updateData.first_name;
  }

  if (updateData.last_name) {
    data.last_name = updateData.last_name;
  }

  if (updateData.email && updateData.email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: updateData.email },
    });

    if (emailExists) {
      throw { status: 400, message: "Email already in use" };
    }

    data.email = updateData.email;
  }

  if (updateData.password) {
    data.password_hash = await bcrypt.hash(updateData.password, 10);
  }

  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

export const deleteUserService = async (userId: number) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw { status: 404, message: "User not found" };
  }

  return prisma.user.delete({
    where: { id: userId },
  });
};
