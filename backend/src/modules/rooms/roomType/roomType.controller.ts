import { Request, Response } from "express";
import { RoomTypeService } from "./roomType.service.ts";
import { CreateRoomTypeInput, UpdateRoomTypeInput } from "./roomType.types.ts";
import { TypedRequest } from "@lib/types.ts";

export const RoomTypeController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await RoomTypeService.getAll();
      const count = data.length;
      res.status(200).json({ count, data });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch room types" });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await RoomTypeService.getById(id);
      res.status(200).json({ data });
    } catch (error: any) {
      if (error.status)
        return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to fetch room type" });
    }
  },

  create: async (req: TypedRequest<CreateRoomTypeInput>, res: Response) => {
    try {
      const data = await RoomTypeService.create(req.body);
      res.status(201).json({ message: "Room Type created successfully", data });
    } catch (error: any) {
      if (error.status)
        return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to create room type" });
    }
  },

  update: async (
    req: TypedRequest<UpdateRoomTypeInput, { id: string }>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      const data = await RoomTypeService.update(id, req.body);
      res.status(200).json({ message: "Room Type updated successfully", data });
    } catch (error: any) {
      if (error.status)
        return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to update room type" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await RoomTypeService.delete(id);
      res.status(200).json({ message: "Room Type deleted successfully" });
    } catch (error: any) {
      if (error.status)
        return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to delete room type" });
    }
  },
};
