import { Response } from "express";
import { AuthRequest } from "../../lib/types.ts";
import { GuestService } from "./guest.service.ts";

const isAdminOrStaff = (req: AuthRequest): boolean => {
  const userRoles = req.user?.user_roles?.map((ur: any) => ur.role?.name) || [];
  return userRoles.some((role: string) => ["ADMIN", "STAFF"].includes(role));
};

export const GuestController = {
  getGuests: async (req: AuthRequest, res: Response) => {
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

  getGuestById: async (req: AuthRequest, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({
          error: "Invalid guest id",
        });
      }

      const guest = await GuestService.getGuestById(id);

      if (!isAdminOrStaff(req) && guest.user_id !== req.user?.id) {
        return res.status(403).json({ error: "Forbidden" });
      }

      return res.status(200).json(guest);
    } catch (error: any) {
      console.error(error);
      return res.status(error.status || 500).json({
        error: error.message || "Failed to fetch guest",
      });
    }
  },

  updateGuest: async (req: AuthRequest, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
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

      if (
        [
          phone_number,
          address,
          city,
          country,
          passport_number,
          date_of_birth,
        ].every((f) => f === undefined)
      ) {
        return res.status(400).json({ error: "No fields provided to update" });
      }

      const dob = date_of_birth ? new Date(date_of_birth) : undefined;

      if (dob && isNaN(dob.getTime())) {
        return res.status(400).json({
          error: "Invalid date_of_birth",
        });
      }

      const guest = await GuestService.getGuestById(id);

      if (!isAdminOrStaff(req) && guest.user_id !== req.user?.id) {
        return res.status(403).json({
          error: "Forbidden: You can only update your own profile",
        });
      }

      const updatedGuest = await GuestService.updateGuestProfile(id, {
        phone_number,
        address,
        city,
        country,
        passport_number,
        date_of_birth: dob,
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
