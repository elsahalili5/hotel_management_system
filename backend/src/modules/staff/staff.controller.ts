import { Response } from "express";
import { StaffService } from "./staff.services";
import { AuthRequest } from "@lib/types.ts";

export const StaffController = {
  getStaff: async (req: AuthRequest, res: Response) => {
    try {
      const staff = await StaffService.getAllStaff();
      return res.status(200).json({ data: staff });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Failed to fetch staff",
      });
    }
  },

  getStaffById: async (req: AuthRequest, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          error: "Invalid staff id",
        });
      }

      const staff = await StaffService.getStaffById(id);

      return res.status(200).json({ data: staff });
    } catch (error: any) {
      console.error(error);

      return res.status(error.status || 500).json({
        error: error.message || "Failed to fetch staff",
      });
    }
  },

  updateStaff: async (req: AuthRequest, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          error: "Invalid staff id",
        });
      }

      const { phone_number, shift, is_active } = req.body;

      if (
        phone_number === undefined &&
        shift === undefined &&
        is_active === undefined
      ) {
        return res.status(400).json({
          error: "No fields provided to update",
        });
      }

      if (shift && !Object.values(Shift).includes(shift as Shift)) {
        return res.status(400).json({
          error: "Invalid shift value",
        });
      }

      const staff = await StaffService.getStaffById(id);
      if (!isAdmin(req) && staff.user_id !== req.user?.id) {
        return res.status(403).json({
          error: "Forbidden: You can only update your own staff profile",
        });
      }

      const updatedStaff = await StaffService.updateStaffProfile(id, {
        phone_number,
        shift,
        is_active,
      });

      return res.status(200).json({
        data: updatedStaff,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(error.status || 500).json({
        error: error.message || "Error updating staff",
      });
    }
  },
};
