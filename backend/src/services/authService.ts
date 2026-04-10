import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcrypt";
import { UserStatus } from "../generated/prisma/enums.ts";
import { User } from "@prisma/client";

const SALT_ROUNDS = 10;

interface UserRegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export const registerUserService = async (data: UserRegisterPayload) => {
  const { first_name, last_name, email, password } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw { status: 400, message: "User already exists" };
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const guestRole = await prisma.role.findUnique({ where: { name: "GUEST" } });
  if (!guestRole) {
    throw { status: 500, message: "Guest role not found" };
  }

  const user = await prisma.user.create({
    data: {
      first_name,
      last_name,
      email,
      password_hash,
      status: UserStatus.ACTIVE,
      user_roles: {
        create: { role_id: guestRole.id },
      },
      guest_profile: {
        create: {},
      },
    },
    include: {
      user_roles: { include: { role: true } },
      guest_profile: true,
    },
  });

  return user;
};

interface UserLoginPayload {
  email: string;
  password: string;
}

export const loginUserService = async (payload: UserLoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      user_roles: { include: { role: true } },
      guest_profile: true,
      staff_profile: true,
    },
  });

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw { status: 401, message: "Invalid credentials" };
  }

  // generate token and return the token and refresh token to the user

  // const roles = user.user_roles.map((ur) => ur.role.name);

  return {
    // id: user.id,
    // email: user.email,
    // roles,
    // guest: user.guest_profile,
    // staff: user.staff_profile,

    user,
  };
};
