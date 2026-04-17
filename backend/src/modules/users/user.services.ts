import { prisma } from "@lib/prisma.ts";
import bcrypt from "bcrypt";
import { Shift, UserStatus } from "@generated/prisma/client.ts";
import { ROLES } from "@lib/roles.ts";
import {
  CreateGuestInput,
  CreateStaffInput,
  UpdateUserInput,
} from "./user.types.ts";
import { safeUserSelect } from "@lib/constants.ts";

const SALT_ROUNDS = 10;

const throwError = (status: number, message: string): never => {
  throw { status, message };
};

export const UserService = {
  createGuest: async (data: CreateGuestInput) => {
    const { first_name, last_name, email, password } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throwError(409, "Email already in use");
    }

    const role = await prisma.role.findUnique({
      where: { name: ROLES.GUEST },
    });

    if (!role?.id) {
      return throwError(404, "GUEST role not found");
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    return prisma.guest.create({
      data: {
        phone_number: data.phone_number ?? null,
        address: data.address ?? null,
        city: data.city ?? null,
        country: data.country ?? null,
        passport_number: data.passport_number ?? null,
        date_of_birth: data.date_of_birth ?? null,

        user: {
          create: {
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email,
            password_hash,
            status: UserStatus.ACTIVE,

            user_roles: {
              create: {
                role_id: role.id,
              },
            },
          },
        },
      },
      select: {
        id: true,
        phone_number: true,
        address: true,
        city: true,
        country: true,
        passport_number: true,
        date_of_birth: true,
        user: {
          select: safeUserSelect,
        },
      },
    });
  },

  createStaff: async (data: CreateStaffInput) => {
    const { first_name, last_name, email, password, role } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throwError(409, "Email already in use");
    }

    const roleRecord = await prisma.role.findUnique({
      where: { name: role },
    });

    if (!roleRecord) {
      return throwError(404, "Role not found");
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    return prisma.user.create({
      data: {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email,
        password_hash,
        status: UserStatus.ACTIVE,

        user_roles: {
          create: {
            role_id: roleRecord.id,
          },
        },

        staff_profile: {
          create: {
            phone_number: data.phone_number ?? null,
            shift: data.shift ?? Shift.MORNING,
          },
        },
      },
      select: {
        ...safeUserSelect,
        user_roles: { include: { role: true } },
        staff_profile: true,
      },
    });
  },

  getUsers: async () => {
    return prisma.user.findMany({
      select: {
        ...safeUserSelect,
        user_roles: { include: { role: true } },
        guest_profile: true,
        staff_profile: true,
      },
    });
  },

  getUserById: async (userId: number) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...safeUserSelect,
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

  updateUser: async (userId: number, updateData: UpdateUserInput) => {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throwError(404, "User not found");
    }

    const data: any = {};

    if (updateData.first_name) data.first_name = updateData.first_name;
    if (updateData.last_name) data.last_name = updateData.last_name;
    if (updateData.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: updateData.email },
      });

      if (emailTaken && emailTaken.id !== userId) {
        throwError(409, "Email already in use");
      }

      data.email = updateData.email;
    }

    if (updateData.password) {
      data.password_hash = await bcrypt.hash(updateData.password, SALT_ROUNDS);
    }

    if (Object.keys(data).length === 0) {
      throwError(400, "No fields to update");
    }

    return prisma.user.update({
      where: { id: userId },
      data,
      select: safeUserSelect,
    });
  },

  deleteUser: async (userId: number) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throwError(404, "User not found");
    }

    return prisma.user.delete({
      where: { id: userId },
      select: safeUserSelect,
    });
  },
};
