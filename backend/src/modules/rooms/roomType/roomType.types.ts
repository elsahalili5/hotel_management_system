import { z } from "zod";
import { 
  roomTypeIdSchema, 
  createRoomTypeSchema, 
  updateRoomTypeSchema 
} from "./roomType.schema.ts";

export type RoomTypeIdParam = z.infer<typeof roomTypeIdSchema>;
export type CreateRoomTypeInput = z.infer<typeof createRoomTypeSchema>;
export type UpdateRoomTypeInput = z.infer<typeof updateRoomTypeSchema>;