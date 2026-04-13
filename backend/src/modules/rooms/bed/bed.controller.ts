import { Request, Response } from "express";
import { BedService } from "./bed.service.ts";
import { CreateBedInput, UpdateBedInput } from "./bed.types.ts";
import { TypedRequestBody } from "@lib/types.ts";

export const BedController = {
 
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await BedService.getAll();
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch beds" });
    }
  },

  
  getById: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await BedService.getById(id);
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(error.status || 404).json({ error: error.message });
    }
  },

  create: async (req: TypedRequestBody<CreateBedInput>, res: Response) => {
    try {
      const data = await BedService.create(req.body);
      res.status(201).json({ 
        message: "Bed created successfully", 
        data 
      });
    } catch (error: any) {
      res.status(error.status || 400).json({ error: error.message });
    }
  },

 
  update: async (
    req: TypedRequestBody<UpdateBedInput, { id: string }>, 
    res: Response
  ) => {
    try {
      const id = Number(req.params.id);
      const data = await BedService.update(id, req.body);
      res.status(200).json({ 
        message: "Bed updated successfully", 
        data 
      });
    } catch (error: any) {
      res.status(error.status || 400).json({ error: error.message });
    }
  },

  
  delete: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result = await BedService.delete(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.status || 400).json({ error: error.message });
    }
  },
};