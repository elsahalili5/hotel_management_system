import { Request, Response } from "express";
import { AmenityService } from "./amenity.service.ts";

export const AmenityController = {
  
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await AmenityService.getAll();
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch amenities" });
    }
  },

  
  getById: async (req: Request, res: Response) => {
    try {
      
      const id = Number(req.params.id);
      const data = await AmenityService.getById(id);
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(error.status || 404).json({ error: error.message });
    }
  },

  
  create: async (req: Request, res: Response) => {
    try {
      const data = await AmenityService.create(req.body);
      res.status(201).json({ message: "Amenity created successfully", data });
    } catch (error: any) {
      res.status(error.status || 400).json({ error: error.message });
    }
  },

  
  update: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await AmenityService.update(id, req.body);
      res.status(200).json({ message: "Amenity updated successfully", data });
    } catch (error: any) {
      res.status(error.status || 400).json({ error: error.message });
    }
  },

  
  delete: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result = await AmenityService.delete(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.status || 400).json({ error: error.message });
    }
  },
};