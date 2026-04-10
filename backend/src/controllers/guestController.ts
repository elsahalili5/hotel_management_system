import { Request, Response } from "express";
import { GuestService } from "../services/guestService.ts";

export const GuestController = {
  getGuests: async (req: Request, res: Response) => {
    try {
      const guests = await GuestService.getAllGuests();

      return res.status(200).json(guests);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Failed to fetch guests",
      });
    }
  },

  getGuestById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: "Invalid guest id",
        });
      }

      const guest = await GuestService.getGuestById(id);

      return res.status(200).json(guest);
    } catch (error: any) {
      console.error(error);

      return res.status(error.status || 500).json({
        error: error.message || "Failed to fetch guest",
      });
    }
  },

  updateGuest: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: "Invalid guest id",
        });
      }

      const {
        phone_number,
        address,
        city,
        country,
        passport_number,
        date_of_birth,
      } = req.body;

      const updatedGuest = await GuestService.updateGuestProfile(id, {
        phone_number,
        address,
        city,
        country,
        passport_number,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : undefined,
      });

      return res.status(200).json(updatedGuest);
    } catch (error: any) {
      console.error(error);

      return res.status(error.status || 500).json({
        error: error.message || "Error updating guest",
      });
    }
  },
};
