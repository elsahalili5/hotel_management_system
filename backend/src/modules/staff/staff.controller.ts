import { Response } from "express";
import { StaffService } from "./staff.service";
import { AuthRequest, TypedRequest } from "@lib/types.ts";
import { StaffIdParam, UpdateStaffInput } from "./staff.types";

export const StaffController = {
  getStaff: async (req: AuthRequest, res: Response) => {
    try {
      const staff = await StaffService.getAllStaff();
      return res.status(200).json({ data: staff });
    } catch (error: any) {
      return res.status(500).json({
        error: "Failed to fetch staff",
      });
    }
  },
  getStaffById: async (
    req: TypedRequest<unknown, StaffIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      const staff = await StaffService.getStaffById(id);

      return res.status(200).json({ data: staff });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        error: error.message || "Failed to fetch staff",
      });
    }
  },

  updateStaff: async (
    req: TypedRequest<UpdateStaffInput, StaffIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      const updatedStaff = await StaffService.updateStaffProfile(id, req.body);

      return res.status(200).json({
        data: updatedStaff,
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        error: error.message || "Error updating staff",
      });
    }
  },
};
