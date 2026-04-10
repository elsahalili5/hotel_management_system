import { Request, Response } from "express";
import { UserService } from "../services/userService.ts";

export const UserController = {
  createGuest: async (req: Request, res: Response) => {
    try {
      const user = await UserService.createGuest(req.body);

      return res.status(201).json({
        message: "Guest created successfully",
        data: user,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(error.status || 500).json({
        message: error.message || "Failed to create guest",
      });
    }
  },

  createStaff: async (req: Request, res: Response) => {
    try {
      const user = await UserService.createStaff(req.body);

      return res.status(201).json({
        message: "Staff created successfully",
        data: user,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(error.status || 500).json({
        message: error.message || "Failed to create staff",
      });
    }
  },

  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await UserService.getAllUsers();

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Failed to fetch users",
      });
    }
  },

  getUserById: async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);

      if (!userId || isNaN(userId)) {
        return res.status(400).json({
          error: "Invalid userId",
        });
      }

      const user = await UserService.getUserById(userId);

      return res.status(200).json(user);
    } catch (error: any) {
      console.error(error);

      return res.status(error.status || 500).json({
        error: error.message || "Failed to fetch user",
      });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);

      if (!userId || isNaN(userId)) {
        return res.status(400).json({
          error: "Invalid userId",
        });
      }

      const updatedUser = await UserService.updateUser(userId, req.body);

      return res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error(error);

      return res.status(error.status || 500).json({
        error: error.message || "Update failed",
      });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.userId);

      if (!userId || isNaN(userId)) {
        return res.status(400).json({
          error: "Invalid userId",
        });
      }

      await UserService.deleteUser(userId);

      return res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error: any) {
      console.error(error);

      return res.status(error.status || 500).json({
        error: error.message || "Delete failed",
      });
    }
  },
};
