import { Response } from "express";
import { StaffService } from "./staff.service";
import { AuthRequest, TypedRequestBody } from "@lib/types.ts";
import { UpdateStaffInput } from "./staff.types";

export const StaffController = {
  getStaff: async (req: AuthRequest, res: Response) => {
    try {
      const staff = await StaffService.getAllStaff();
      return res.status(200).json({ data: staff });
    } catch (error: any) {
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

  updateStaff: async (
    req: TypedRequestBody<UpdateStaffInput> & AuthRequest,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          error: "Invalid staff id",
        });
      }

      const updatedStaff = await StaffService.updateStaffProfile(id, req.body);

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
