import { Request, Response } from "express";
import { RoomService } from "./room.service.ts";
import {
  CreateRoomInput,
  UpdateRoomInput,
  UpdateRoomStatusInput,
  RoomIdParam,
} from "./room.types.ts";
import { TypedRequest } from "@lib/types.ts";

export const RoomController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await RoomService.getAll();
      res.status(200).json({ data });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  },

  getById: async (req: TypedRequest<unknown, RoomIdParam>, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await RoomService.getById(id);
      res.status(200).json({ data });
    } catch (error: any) {
      if (error.status)
        return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to fetch room" });
    }
  },

  create: async (req: TypedRequest<CreateRoomInput>, res: Response) => {
    try {
      const data = await RoomService.create(req.body);
      res.status(201).json({ message: "Room created successfully", data });
    } catch (error: any) {
      if (error.status)
        return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to create room" });
    }
  },

  update: async (
    req: TypedRequest<UpdateRoomInput, RoomIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      const data = await RoomService.update(id, req.body);
      res.status(200).json({ message: "Room updated successfully", data });
    } catch (error: any) {
      if (error.status)
        return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to update room" });
    }
  },

  updateStatus: async (
    req: TypedRequest<UpdateRoomStatusInput, RoomIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      const data = await RoomService.updateStatus(id, req.body);
      res
        .status(200)
        .json({ message: "Room status updated successfully", data });
    } catch (error: any) {
      if (error.status)
        return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to update room status" });
    }
  },

  delete: async (req: TypedRequest<unknown, RoomIdParam>, res: Response) => {
    try {
      const id = Number(req.params.id);
      await RoomService.delete(id);
      res.status(200).json({ message: "Room deleted successfully" });
    } catch (error: any) {
      if (error.status)
        return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to delete room" });
    }
  },

  getStats: async (_req: Request, res: Response) => {
    try {
      const data = await RoomService.getStats();
      res.status(200).json({ data });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to fetch room stats" });
    }
  },
};
