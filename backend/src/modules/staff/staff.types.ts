import { z } from "zod";
import { updateStaffSchema, staffIdParamSchema } from "./staff.schema";
import type { UserStatus, Shift } from "@generated/prisma/enums.ts";

export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
export type StaffIdParam = z.infer<typeof staffIdParamSchema>;

export type StaffResponse = {
  id: number;
  user_id: number;
  phone_number: string | null;
  shift: Shift;
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
