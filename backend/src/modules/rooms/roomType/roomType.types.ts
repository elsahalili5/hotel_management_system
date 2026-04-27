import { z } from "zod";
import {
  roomTypeIdSchema,
  createRoomTypeSchema,
  updateRoomTypeSchema
} from "./roomType.schema.ts";

export type RoomTypeIdParam = z.infer<typeof roomTypeIdSchema>;
export type CreateRoomTypeInput = z.infer<typeof createRoomTypeSchema>;
export type UpdateRoomTypeInput = z.infer<typeof updateRoomTypeSchema>;

export type RoomTypeResponse = {
  id: number
  name: string
  description: string | null
  base_price: string
  max_occupancy: number
  size_m2: number | null
  amenities: { amenity: { id: number; name: string; icon: string | null } }[]
  beds: { bed: { id: number; name: string; capacity: number }; quantity: number }[]
  images: { id: number; url: string; is_primary: boolean; alt_text: string | null }[]
  _count: { rooms: number }
}