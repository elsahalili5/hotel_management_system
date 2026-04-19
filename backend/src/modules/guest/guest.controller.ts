import { Response } from "express";
import { AuthRequest, TypedRequest } from "@lib/types.ts";
import { GuestService } from "./guest.service.ts";
import { UpdateGuestInput, GuestIdParam } from "./guest.types.ts";
import { ROLES } from "@lib/roles.ts";

export const GuestController = {
  getGuests: async (_req: AuthRequest, res: Response) => {
    try {
      const guests = await GuestService.getAllGuests();
      return res.status(200).json(guests);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }

      return res.status(500).json({
        error: "Failed to fetch guests",
      });
    }
  },

  getGuestById: async (
    req: TypedRequest<unknown, GuestIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      const guest = await GuestService.getGuestById(id);

      return res.status(200).json(guest);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }

      return res.status(500).json({
        error: "Failed to fetch guest",
      });
    }
  },
  updateGuest: async (
    req: TypedRequest<UpdateGuestInput, GuestIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);

      const {
        phone_number,
        address,
        city,
        country,
        passport_number,
        date_of_birth,
      } = req.body;

      const requestingUser = (req as AuthRequest).user;
      const isGuest = requestingUser?.user_roles?.some(
        (ur) => ur.role?.name === ROLES.GUEST,
      );

      const updatedGuest = await GuestService.updateGuestProfile(
        id,
        {
          phone_number,
          address,
          city,
          country,
          passport_number,
          date_of_birth,
        },
        isGuest ? requestingUser?.id : undefined,
      );

      return res.status(200).json(updatedGuest);
    } catch (error: any) {
      console.error(error);

      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }

      return res.status(500).json({
        error: "Error updating guest",
      });
    }
  },
};
