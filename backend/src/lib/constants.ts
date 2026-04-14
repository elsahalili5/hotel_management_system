import {
  BedDefaultArgs,
  RoomDefaultArgs,
  UserDefaultArgs,
} from "@generated/prisma/models";

export const safeUserSelect: UserDefaultArgs["select"] = {
  id: true,
  first_name: true,
  last_name: true,
  email: true,
  status: true,
  email_confirmed: true,
  user_roles: true,
};

export const roomSelect: RoomDefaultArgs["select"] = {
  id: true,
  room_number: true,
  floor: true,
  status: true,
  room_type: {
    select: {
      id: true,
      name: true,
      base_price: true,
      max_occupancy: true,
    },
  },
};

export const bedSelect: BedDefaultArgs["select"] = {
  id: true,
  name: true,
  capacity: true,
};
