import { Request, Response } from "express";
import {
  getAllStaffService,
  getStaffByIdService,
  updateStaffProfile,
} from "../services/staffService.ts";

export const getStaff = async (req: Request, res: Response) => {
  try {
    const staff = await getAllStaffService();
    res.status(200).json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
};

export const getStaffById = async (req: Request, res: Response) => {
  try {
    const staffId = Number(req.params.id);
    if (isNaN(staffId))
      return res.status(400).json({ error: "Invalid staff id" });

    const staff = await getStaffByIdService(staffId);

    res.status(200).json(staff);
  } catch (error: any) {
    console.error(error);
    const status = error.status ?? 500;
    const message = error.message ?? "Failed to fetch staff";
    res.status(status).json({ error: message });
  }
};
export const updateStaff = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { phone_number, shift, is_active } = req.body;

    const updatedStaff = await updateStaffProfile(
      id,
      phone_number,
      shift,
      is_active,
    );

    res.status(200).json({
      message: "Staff profile updated successfully",
      data: updatedStaff,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
