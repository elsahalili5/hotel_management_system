import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcrypt";
import { Shift, UserStatus } from "../generated/prisma/client.ts";

const SALT_ROUNDS = 10;

const ALLOWED_STAFF_ROLES = [
  "MANAGER",
  "RECEPTIONIST",
  "HOUSEKEEPING",
] as const;

interface CreateGuestPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  city?: string;
  country?: string;
  passport_number?: string;
  date_of_birth?: Date;
}

interface CreateStaffPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: (typeof ALLOWED_STAFF_ROLES)[number];
  phone_number?: string;
  shift?: Shift;
}

interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
}

const throwError = (status: number, message: string) => {
  throw { status, message };
};

export const UserService = {
  // ---------------- CREATE GUEST ----------------
  createGuest: async (data: CreateGuestPayload) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throwError(400, "User already exists");
    }

    const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

    return await prisma.guest.create({
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
            status: UserStatus.ACTIVE,
          },
        },
      },
      include: {
        user: true,
      },
    });
  },

  // ---------------- CREATE STAFF ----------------
  createStaff: async (data: CreateStaffPayload) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throwError(400, "User already exists");
    }

    const role = await prisma.role.findUnique({
      where: { name: data.role },
    });

    if (!role) {
      throwError(404, "Role not found");
    }

    const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

    return await prisma.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password_hash,
        status: UserStatus.ACTIVE,

        user_roles: {
          create: {
            role_id: role!.id,
          },
        },

        staff_profile: {
          create: {
            phone_number: data.phone_number ?? null,
            shift: data.shift ?? Shift.MORNING,
          },
        },
      },

      include: {
        user_roles: {
          include: { role: true },
        },
        staff_profile: true,
      },
    });
  },

  // ---------------- GET ALL USERS ----------------
  getAllUsers: async () => {
    return await prisma.user.findMany({
      include: {
        user_roles: { include: { role: true } },
        guest_profile: true,
        staff_profile: true,
      },
    });
  },

  // ---------------- GET USER BY ID ----------------
  getUserById: async (userId: number) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        user_roles: { include: { role: true } },
        guest_profile: true,
        staff_profile: true,
      },
    });

    if (!user) {
      throwError(404, "User not found");
    }

    return user;
  },

  // ---------------- UPDATE USER ----------------
  updateUser: async (userId: number, updateData: UpdateUserPayload) => {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throwError(404, "User not found");
    }

    const data: any = {};

    if (updateData.first_name) data.first_name = updateData.first_name;
    if (updateData.last_name) data.last_name = updateData.last_name;

    if (updateData.email && updateData.email !== existingUser!.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: updateData.email },
      });

      if (emailExists) {
        throwError(400, "Email already in use");
      }

      data.email = updateData.email;
    }

    if (updateData.password) {
      data.password_hash = await bcrypt.hash(updateData.password, SALT_ROUNDS);
    }

    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  },

  // ---------------- DELETE USER ----------------
  deleteUser: async (userId: number) => {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throwError(404, "User not found");
    }

    return await prisma.user.delete({
      where: { id: userId },
    });
  },
};
