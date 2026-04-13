import { z } from "zod";
import { 
  roomTypeIdSchema, 
  createRoomTypeSchema, 
  updateRoomTypeSchema 
} from "./roomType.schema.ts";

export type RoomTypeId = z.infer<typeof roomTypeIdSchema>["id"];
export type CreateRoomTypeInput = z.infer<typeof createRoomTypeSchema>;
export type UpdateRoomTypeInput = z.infer<typeof updateRoomTypeSchema>;