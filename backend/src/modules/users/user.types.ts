import { z } from "zod";
import {
  createGuestSchema,
  createStaffSchema,
  updateUserSchema,
} from "./user.schema";

export type CreateGuestInput = z.infer<typeof createGuestSchema>;

export type CreateStaffInput = z.infer<typeof createStaffSchema>;

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
