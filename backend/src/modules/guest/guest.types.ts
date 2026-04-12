import { z } from "zod";
import { guestIdParamSchema, updateGuestSchema } from "./guest.schema";

export type GuestIdParam = z.infer<typeof guestIdParamSchema>;
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;
