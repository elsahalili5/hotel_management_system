import { Response } from "express";
import { AuthRequest } from "../utils/types.ts";
import { StaffService } from "../services/staffService.ts";
import { Shift } from "../generated/prisma/client.ts";

const isAdmin = (req: AuthRequest) =>
  req.user?.user_roles?.some((r: any) => r.role?.name === "ADMIN");

const isAdminOrStaff = (req: AuthRequest) =>
  req.user?.user_roles?.some((r: any) =>
    ["ADMIN", "STAFF"].includes(r.role?.name),
  );

export const StaffController = {
  getStaff: async (req: AuthRequest, res: Response) => {
    try {
      if (!isAdminOrStaff(req)) {
        return res.status(403).json({ error: "Forbidden" });
      }

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

      if (!isAdmin(req) && staff.user_id !== req.user?.id) {
        return res.status(403).json({
          error: "Forbidden",
        });
      }

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
