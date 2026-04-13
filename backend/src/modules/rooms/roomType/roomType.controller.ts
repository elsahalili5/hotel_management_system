import { Request, Response } from "express";
import { RoomTypeService } from "./roomType.service.ts";
import { CreateRoomTypeInput, UpdateRoomTypeInput } from "./roomType.types.ts";
import { TypedRequestBody } from "@lib/types.ts";

export const RoomTypeController = {
 
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await RoomTypeService.getAll();
      res.status(200).json({data});
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch room types" });
    }
  },

 
  getById: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await RoomTypeService.getById(id);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      
      res.status(error.status || 400).json({ error: error.message });
    }
  },

  
  create: async (req: TypedRequestBody<CreateRoomTypeInput>, res: Response) => {
    try {
      const data = await RoomTypeService.create(req.body);
      res.status(201).json({ 
        success: true,
        message: "Room Type created successfully", 
        data 
      });
    } catch (error: any) {
     
      res.status(error.status || 400).json({ error: error.message });
    }
  },

  
  update: async (
    req: TypedRequestBody<UpdateRoomTypeInput, { id: string }>, 
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);
      const data = await RoomTypeService.update(id, req.body);
      res.status(200).json({ 
        success: true,
        message: "Room Type updated successfully", 
        data 
      });
    } catch (error: any) {
      res.status(error.status || 400).json({ error: error.message });
    }
  },

  
  delete: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result = await RoomTypeService.delete(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.status || 400).json({ error: error.message });
    }
  },
};