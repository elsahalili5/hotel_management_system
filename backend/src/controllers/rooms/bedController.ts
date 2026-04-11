import { Request, Response } from "express";
import { BedService } from "../../services/rooms/bedService.ts";

export const BedController = {
  getBeds: async (_req: Request, res: Response) => {
    try {
      const beds = await BedService.getAllBeds();
      res.status(200).json(beds);
    } catch (error) {
      console.error("Error fetching beds:", error);
      res.status(500).json({ error: "Internal server error while fetching beds" });
    }
  },

  createBed: async (req: Request, res: Response) => {
    try {
      const { name, capacity } = req.body;

      if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Bed name is required" });
      }
      if (!capacity || isNaN(Number(capacity)) || Number(capacity) <= 0 || !Number.isInteger(Number(capacity))) {
        return res.status(400).json({ error: "Capacity must be a positive whole number" });
      }

      const newBed = await BedService.createNewBed(name.trim(), Number(capacity));
      res.status(201).json(newBed);
    } catch (error: any) {
      console.error("Error creating bed:", error);
      const status = error.status ?? 500;
      const message = error.message ?? "Internal server error while creating bed";
      res.status(status).json({ error: message });
    }
  },

  editBed: async (req: Request, res: Response) => {
    try {
      const idParam = req.query.id;
      const { name, capacity } = req.body;

      if (!idParam) {
        return res.status(400).json({ error: "Bed ID is required in query parameters" });
      }

      const bedId = Number(idParam);
      if (isNaN(bedId)) {
        return res.status(400).json({ error: "ID must be a valid number" });
      }

      if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Name cannot be empty" });
      }
      if (!capacity || isNaN(Number(capacity)) || Number(capacity) <= 0 || !Number.isInteger(Number(capacity))) {
        return res.status(400).json({ error: "Capacity must be a positive whole number" });
      }

      const existing = await BedService.getBedById(bedId);
      if (!existing) {
        return res.status(404).json({ error: "Bed type not found" });
      }

      const updatedBed = await BedService.updateBed(bedId, name.trim(), Number(capacity));
      res.status(200).json(updatedBed);
    } catch (error: any) {
      console.error("Error updating bed:", error);
      const status = error.status ?? 500;
      const message = error.message ?? "Internal server error while updating bed";
      res.status(status).json({ error: message });
    }
  },

  deleteBed: async (req: Request, res: Response) => {
    try {
      const idParam = req.query.id;

      if (!idParam) {
        return res.status(400).json({ error: "Bed ID is required for deletion" });
      }

      const bedId = Number(idParam);
      if (isNaN(bedId)) {
        return res.status(400).json({ error: "ID must be a valid number" });
      }

      const existing = await BedService.getBedById(bedId);
      if (!existing) {
        return res.status(404).json({ error: "Bed not found" });
      }

      await BedService.removeBed(bedId);
      res.status(200).json({ message: "Bed deleted successfully", deletedBed: existing.name });
    } catch (error: any) {
      console.error("Error deleting bed:", error);
      const status = error.status ?? 500;
      const message = error.message ?? "Internal server error while deleting bed";
      res.status(status).json({ error: message });
    }
  },
};