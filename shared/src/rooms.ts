export type {
  RoomTypeResponse,
  CreateRoomTypeInput,
  UpdateRoomTypeInput,
} from "../../backend/src/modules/rooms/roomType/roomType.types.ts";

export type {
  CreateAmenityInput,
  UpdateAmenityInput,
  AmenityResponse,
} from "../../backend/src/modules/rooms/amenity/amenity.types.ts";

export type {
  CreateBedInput,
  UpdateBedInput,
  BedResponse,
} from "../../backend/src/modules/rooms/bed/bed.types.ts";

export type {
  CreateRoomInput,
  UpdateRoomInput,
  UpdateRoomStatusInput,
  RoomResponse,
} from "../../backend/src/modules/rooms/room/room.types.ts";

export { RoomStatus } from "../../backend/src/generated/prisma/enums.ts";
export type { RoomStatus as RoomStatusType } from "../../backend/src/generated/prisma/enums.ts";
