import { z } from "zod";
import {
  createRoomSchema,
  updateRoomSchema,
  updateRoomStatusSchema,
  roomIdSchema,
} from "./room.schema.ts";

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type RoomId = z.infer<typeof roomIdSchema>["id"];
export type UpdateRoomStatusInput = z.infer<typeof updateRoomStatusSchema>;
