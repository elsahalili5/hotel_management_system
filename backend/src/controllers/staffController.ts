import { Request, Response } from "express";
import { StaffService } from "../services/staffService.ts";

export const StaffController = {
  getStaff: async (req: Request, res: Response) => {
    try {
      const staff = await StaffService.getAllStaff();

      return res.status(200).json(staff);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Failed to fetch staff",
      });
    }
  },

  getStaffById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: "Invalid staff id",
        });
      }

      const staff = await StaffService.getStaffById(id);

      return res.status(200).json(staff);
    } catch (error: any) {
      console.error(error);

      return res.status(error.status || 500).json({
        error: error.message || "Failed to fetch staff",
      });
    }
  },

  updateStaff: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: "Invalid staff id",
        });
      }

      const { phone_number, shift, is_active } = req.body;

      const updatedStaff = await StaffService.updateStaffProfile(id, {
        phone_number,
        shift,
        is_active,
      });

      return res.status(200).json({
        message: "Staff profile updated successfully",
        data: updatedStaff,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(error.status || 500).json({
        message: error.message || "Error updating staff",
      });
    }
  },
};
