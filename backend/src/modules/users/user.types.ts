import { z } from "zod";
import {
  createGuestSchema,
  createStaffSchema,
  updateUserSchema,
  userIdParamSchema,
} from "./user.schema";

export type CreateGuestInput = z.infer<typeof createGuestSchema>;

export type CreateStaffInput = z.infer<typeof createStaffSchema>;

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
