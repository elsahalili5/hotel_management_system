import { Response } from "express";
import { StaffService } from "./staff.service";
import { AuthRequest, TypedRequest } from "@lib/types.ts";
import { StaffIdParam, UpdateStaffInput } from "./staff.types";
import { ROLES, RoleType } from "@lib/roles.ts";
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
      const currentUser = (req as AuthRequest).user;
      if (!currentUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const staff = await StaffService.getStaffById(id);

      const userRoles: RoleType[] =
        currentUser?.user_roles?.map((ur) => ur.role?.name as RoleType) || [];

      const isAdminOrManager =
        userRoles.includes(ROLES.ADMIN) || userRoles.includes(ROLES.MANAGER);

      const isSelf = staff.user_id === currentUser.id;
      if (!isAdminOrManager && !isSelf) {
        return res.status(403).json({
          error: "You can only update your own staff profile",
        });
      }

      // veq  admin/manager mun e ndrron is_active
      if (!isAdminOrManager && req.body.is_active !== undefined) {
        return res.status(403).json({
          error: "You cannot change active status",
        });
      }

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
