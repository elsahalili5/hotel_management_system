import { z } from "zod";
import { guestIdParamSchema, updateGuestSchema } from "./guest.schema";
import type { UserStatus } from "@generated/prisma/enums.ts";

export type GuestIdParam = z.infer<typeof guestIdParamSchema>;
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;

export type GuestResponse = {
  id: number;
  user_id: number;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  passport_number: string | null;
  date_of_birth: Date | null;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    status: UserStatus;
    email_confirmed: boolean;
    user_roles: { role_id: number; user_id: number }[];
  };
};
