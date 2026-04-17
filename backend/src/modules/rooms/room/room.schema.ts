import { z } from "zod";
import { RoomStatus } from "@generated/prisma/enums.ts";
import { numericStringSchema } from "@lib/validations";

export const roomIdSchema = z.object({
  id: numericStringSchema,
});

export const createRoomSchema = z.object({
  room_number: z
    .string({ message: "Room number is required" })
    .trim()
    .min(1, "Room number cannot be empty")
    .max(10, "Room number is too long"),

  floor: z.coerce
    .number({ message: "Floor must be a number" })
    .int()
    .min(0, "Floor cannot be negative"),

  room_type_id: z.coerce
    .number({ message: "Room type ID must be a number" })
    .int()
    .positive("Room type ID must be a positive number"),

  status: z.enum(RoomStatus).optional().default(RoomStatus.AVAILABLE),
});

export const updateRoomStatusSchema = z.object({
  status: z.enum(RoomStatus),
});

export const updateRoomSchema = createRoomSchema
  .omit({ status: true })
  .partial()
  .extend({ status: z.enum(RoomStatus).optional() })
  .refine(
    (data) =>
      data.room_number !== undefined ||
      data.floor !== undefined ||
      data.room_type_id !== undefined ||
      data.status !== undefined,
    {
      message: "At least one field must be provided for update",
    },
  );
