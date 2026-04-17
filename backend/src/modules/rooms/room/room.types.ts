import { z } from "zod";
import {
  createRoomSchema,
  updateRoomSchema,
  updateRoomStatusSchema,
  roomIdSchema,
} from "./room.schema.ts";

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type RoomIdParam = z.infer<typeof roomIdSchema>;
export type UpdateRoomStatusInput = z.infer<typeof updateRoomStatusSchema>;