import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.ts";
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
      if (!capacity || capacity <= 0) {
        return res.status(400).json({ error: "Valid capacity is required" });
      }

      const existingBed = await prisma.bed.findUnique({
        where: { name: name.trim() }
      });

      if (existingBed) {
        return res.status(409).json({
          error: "A bed with this name already exists",
          suggestion: "Use a different name or update the existing one"
        });
      }

      const newBed = await BedService.createNewBed(name.trim(), Number(capacity));
      res.status(201).json(newBed);
    } catch (error) {
      console.error("Error creating bed:", error);
      res.status(500).json({ error: "Internal server error while creating bed" });
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

      const existing = await prisma.bed.findUnique({ where: { id: bedId } });
      if (!existing) {
        return res.status(404).json({ error: "Bed type not found" });
      }

      if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Name cannot be empty" });
      }
      if (!capacity || capacity <= 0) {
        return res.status(400).json({ error: "Capacity must be a positive number" });
      }

      const updatedBed = await BedService.updateBed(bedId, name, Number(capacity));
      res.status(200).json(updatedBed);
    } catch (error) {
      console.error("Error updating bed:", error);
      res.status(500).json({ error: "Internal server error while updating bed" });
    }
  },

  deleteBed: async (req: Request, res: Response) => {
    try {
      const idParam = req.query.id;

      if (!idParam) {
        return res.status(400).json({ error: "Bed ID is required for deletion" });
      }

      const bedId = Number(idParam);

      const existing = await prisma.bed.findUnique({ where: { id: bedId } });
      if (!existing) {
        return res.status(404).json({ error: "Bed not found" });
      }

      await BedService.removeBed(bedId);
      res.status(200).json({ message: "Bed deleted successfully", deletedBed: existing.name });
    } catch (error) {
      console.error("Error deleting bed:", error);
      res.status(500).json({ error: "Internal server error while deleting bed" });
    }
  },
};