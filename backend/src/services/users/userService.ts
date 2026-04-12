import { prisma } from "../../lib/prisma.ts";
import bcrypt from "bcrypt";
import { Shift, UserStatus } from "../../generated/prisma/client.ts";
import { isValidEmail } from "../../utils/validations.ts";

const SALT_ROUNDS = 10;

const ALLOWED_STAFF_ROLES = [
  "MANAGER",
  "RECEPTIONIST",
  "HOUSEKEEPING",
] as const;

export interface CreateGuestPayload {
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

export interface CreateStaffPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: (typeof ALLOWED_STAFF_ROLES)[number];
  phone_number?: string;
  shift?: Shift;
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
}

const throwError = (status: number, message: string): never => {
  throw { status, message };
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email: string) => email.toLowerCase();

const safeUserSelect = {
  id: true,
  first_name: true,
  last_name: true,
  email: true,
  status: true,
  created_at: true,
};

export const UserService = {
  createGuest: async (data: CreateGuestPayload) => {
    const email = normalizeEmail(data.email);

    if (!emailRegex.test(email)) {
      throwError(400, "Invalid email format");
    }

    if (data.password.length < 8) {
      throwError(400, "Password must be at least 8 characters");
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      throwError(409, "Email already in use");
    }

    const role = await prisma.role.findUnique({
      where: { name: "GUEST" },
    });

    if (!role) {
      throwError(404, "GUEST role not found");
      return;
    }

    const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const guest = await prisma.guest.create({
      data: {
        phone_number: data.phone_number ?? null,
        address: data.address ?? null,
        city: data.city ?? null,
        country: data.country ?? null,
        passport_number: data.passport_number ?? null,
        date_of_birth: data.date_of_birth ?? null,

        user: {
          create: {
            first_name: data.first_name,
            last_name: data.last_name,
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

    return guest;
  },

  // ---------------- CREATE STAFF ----------------
  createStaff: async (data: CreateStaffPayload) => {
    const email = normalizeEmail(data.email);

    if (!isValidEmail(email)) {
      throwError(400, "Invalid email format");
    }

    if (data.password.length < 8) {
      throwError(400, "Password must be at least 8 characters");
    }

    if (!ALLOWED_STAFF_ROLES.includes(data.role)) {
      throwError(400, "Invalid staff role");
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      throwError(409, "Email already in use");
    }

    const role = await prisma.role.findUnique({
      where: { name: data.role },
    });

    if (!role) {
      throwError(404, "Role not found");
      return;
    }

    const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        email,
        password_hash,
        status: UserStatus.ACTIVE,

        user_roles: {
          create: {
            role_id: role.id,
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

    return user;
  },

  // ---------------- GET ALL USERS ----------------
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

  // ---------------- GET USER BY ID ----------------
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

    if (updateData.email) {
      const email = normalizeEmail(updateData.email);

      if (!emailRegex.test(email)) {
        throwError(400, "Invalid email format");
      }

      if (email !== existingUser?.email) {
        const exists = await prisma.user.findUnique({
          where: { email },
        });

        if (exists) {
          throwError(409, "Email already in use");
        }

        data.email = email;
      }
    }

    if (updateData.password) {
      if (updateData.password.length < 8) {
        throwError(400, "Password must be at least 8 characters");
      }

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

  // ---------------- DELETE USER ----------------
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
