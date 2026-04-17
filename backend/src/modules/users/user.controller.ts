import { Response } from "express";
import { UserService } from "./user.services.ts";
import { AuthRequest } from "@lib/types.ts";
import {
  CreateGuestInput,
  CreateStaffInput,
  UpdateUserInput,
  UserIdParam,
} from "./user.types.ts";

import { TypedRequest } from "@lib/types.ts";

export const UserController = {
  createGuest: async (req: TypedRequest<CreateGuestInput>, res: Response) => {
    try {
      const guest = await UserService.createGuest(req.body);

      return res.status(201).json(guest);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to create guest" });
    }
  },

  createStaff: async (req: TypedRequest<CreateStaffInput>, res: Response) => {
    try {
      const staff = await UserService.createStaff(req.body);

      return res.status(201).json(staff);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to create staff" });
    }
  },

  getUsers: async (req: AuthRequest, res: Response) => {
    try {
      const users = await UserService.getUsers();

      return res.status(200).json(users);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  getUserById: async (
    req: AuthRequest & TypedRequest<unknown, UserIdParam>,
    res: Response,
  ) => {
    try {
      const userId = req.params.userId as unknown as number;
      const user = await UserService.getUserById(userId);

      return res.status(200).json(user);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  },
  updateUser: async (
    req: TypedRequest<UpdateUserInput, UserIdParam>,
    res: Response,
  ) => {
    try {
      const userId = req.params.userId as unknown as number;
      const user = await UserService.updateUser(userId, req.body);

      return res.status(200).json(user);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to update user" });
    }
  },

  deleteUser: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.userId as unknown as number;
      await UserService.deleteUser(userId);

      return res.status(204).send();
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to delete user" });
    }
  },
};
