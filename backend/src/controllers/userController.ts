import { Request, Response } from "express";
import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  createGuest,
  createStaff,
} from "../services/userService.ts";

export const createGuestC = async (req: Request, res: Response) => {
  try {
    const user = await createGuest(req.body);

    res.status(201).json({
      message: "Guest created successfully",
      data: user,
    });
  } catch (error: any) {
    console.error(error);

    res.status(error.status || 500).json({
      message: error.message || "Failed to create guest",
    });
  }
};

export const createStaffC = async (req: Request, res: Response) => {
  try {
    const user = await createStaff(req.body);

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    console.error(error);

    res.status(error.status || 500).json({
      message: error.message || "Failed to create user",
    });
  }
};
// ---------------- GET ALL USERS ----------------
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ---------------- GET USER BY ID ----------------
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const user = await getUserByIdService(userId);

    res.status(200).json(user);
  } catch (error: any) {
    console.error(error);

    res.status(error.status || 500).json({
      error: error.message || "Failed to fetch user",
    });
  }
};

// ---------------- UPDATE USER ----------------
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const updatedUser = await updateUserService(userId, req.body);

    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error(error);

    res.status(error.status || 500).json({
      error: error.message || "Update failed",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    await deleteUserService(userId);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error(error);

    res.status(error.status || 500).json({
      error: error.message || "Delete failed",
    });
  }
};
