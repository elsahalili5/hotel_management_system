import { z } from "zod";
import {
  createGuestSchema,
  createStaffSchema,
  updateUserSchema,
  userIdParamSchema,
} from "./user.schema";
import type { UserStatus, Shift } from "@generated/prisma/enums.ts";

export type CreateGuestInput = z.infer<typeof createGuestSchema>;
export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;

export type UserResponse = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: UserStatus;
  email_confirmed: boolean;
  user_roles: { role_id: number; user_id: number; role: { id: number; name: string } }[];
  guest_profile: {
    id: number;
    phone_number: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    passport_number: string | null;
    date_of_birth: Date | null;
  } | null;
  staff_profile: {
    id: number;
    phone_number: string | null;
    shift: Shift;
  } | null;
};
