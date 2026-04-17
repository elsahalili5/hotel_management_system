import { Request, Response } from "express";
import { AmenityService } from "./amenity.service.ts";
import { CreateAmenityInput, UpdateAmenityInput } from "./amenity.types.ts";
import { TypedRequest } from "@lib/types.ts";

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
      if (error.status)
        return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to fetch amenity" });
    }
  },

  create: async (req: TypedRequest<CreateAmenityInput>, res: Response) => {
    try {
      const data = await AmenityService.create(req.body);
      res.status(201).json({ message: "Amenity created successfully", data });
    } catch (error: any) {
      if (error.status)
        return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to create amenity" });
    }
  },

  update: async (
    req: TypedRequest<UpdateAmenityInput, { id: string }>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      const data = await AmenityService.update(id, req.body);
      res.status(200).json({ message: "Amenity updated successfully", data });
    } catch (error: any) {
      if (error.status)
        return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to update amenity" });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await AmenityService.delete(id);
      res.status(200).json({ message: "Amenity deleted successfully" });
    } catch (error: any) {
      if (error.status)
        return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to delete amenity" });
    }
  },
};
