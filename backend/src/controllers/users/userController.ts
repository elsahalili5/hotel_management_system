import { Response } from "express";
import { AuthRequest } from "../../utils/types.ts";
import { UserService } from "../../services/users/userService.ts";

export const UserController = {
  createGuest: async (req: AuthRequest, res: Response) => {
    try {
      const guest = await UserService.createGuest(req.body);
      return res.status(201).json(guest);
    } catch (error: any) {
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Failed to create guest" });
    }
  },

  createStaff: async (req: AuthRequest, res: Response) => {
    try {
      const staff = await UserService.createStaff(req.body);
      return res.status(201).json(staff);
    } catch (error: any) {
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Failed to create staff" });
    }
  },

  getUsers: async (req: AuthRequest, res: Response) => {
    try {
      const users = await UserService.getUsers();
      return res.status(200).json(users);
    } catch (error: any) {
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Failed to fetch users" });
    }
  },

  getUserById: async (req: AuthRequest, res: Response) => {
    try {
      const userId = Number(req.params.userId);

      if (Number.isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user id" });
      }

      const requestingRoles =
        req.user?.user_roles?.map((ur: any) => ur.role?.name) ?? [];

      const canViewAny = [
        "ADMIN",
        "MANAGER",
        "RECEPTIONIST",
        "HOUSEKEEPING",
      ].some((r) => requestingRoles.includes(r));

      if (req.user?.id !== userId && !canViewAny) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const user = await UserService.getUserById(userId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Failed to fetch user" });
    }
  },

  updateUser: async (req: AuthRequest, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      if (Number.isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user id" });
      }

      const requestingRoles =
        req.user?.user_roles?.map((ur: any) => ur.role?.name) ?? [];

      const isAdmin = requestingRoles.includes("ADMIN");

      if (req.user?.id !== userId && !isAdmin) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const user = await UserService.updateUser(userId, req.body);
      return res.status(200).json(user);
    } catch (error: any) {
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Failed to update user" });
    }
  },

  deleteUser: async (req: AuthRequest, res: Response) => {
    try {
      const userId = Number(req.params.userId);
      if (Number.isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user id" });
      }
      await UserService.deleteUser(userId);
      return res.status(204).send();
    } catch (error: any) {
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Failed to delete user" });
    }
  },
};
