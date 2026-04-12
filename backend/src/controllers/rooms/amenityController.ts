import { Request, Response } from "express";
import { AmenityService } from "../../services/rooms/amenityService.ts";

export const AmenityController = {
  getAmenities: async (_req: Request, res: Response) => {
    try {
      const data = await AmenityService.getAllAmenities();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching amenities:", error);
      res
        .status(500)
        .json({ error: "Internal server error while fetching amenities" });
    }
  },

  createAmenity: async (req: Request, res: Response) => {
    try {
      const { name, icon } = req.body;

      if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Amenity name is required" });
      }

      const newAmenity = await AmenityService.createNewAmenity(
        name.trim(),
        icon?.trim(),
      );
      res.status(201).json(newAmenity);
    } catch (error: any) {
      console.error("Error creating amenity:", error);
      const status = error.status ?? 500;
      const message =
        error.message ?? "Internal server error while creating amenity";
      res.status(status).json({ error: message });
    }
  },

  editAmenity: async (req: Request, res: Response) => {
    try {
      const idParam = req.query.id;
      const { name, icon } = req.body;

      if (!idParam) {
        return res
          .status(400)
          .json({ error: "Missing amenity ID in query parameters" });
      }

      const amenityId = Number(idParam);
      if (isNaN(amenityId)) {
        return res.status(400).json({ error: "ID must be a valid number" });
      }

      if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Amenity name cannot be empty" });
      }

      const existing = await AmenityService.getAmenityById(amenityId);
      if (!existing) {
        return res.status(404).json({ error: "Amenity not found" });
      }

      const updated = await AmenityService.updateAmenity(
        amenityId,
        name.trim(),
        icon?.trim(),
      );
      res.status(200).json(updated);
    } catch (error: any) {
      console.error("Error updating amenity:", error);
      const status = error.status ?? 500;
      const message =
        error.message ?? "Internal server error while updating amenity";
      res.status(status).json({ error: message });
    }
  },

  deleteAmenity: async (req: Request, res: Response) => {
    try {
      const idParam = req.query.id;

      if (!idParam) {
        return res
          .status(400)
          .json({ error: "Missing amenity ID in query parameters" });
      }

      const amenityId = Number(idParam);
      if (isNaN(amenityId)) {
        return res.status(400).json({ error: "ID must be a valid number" });
      }

      const existing = await AmenityService.getAmenityById(amenityId);
      if (!existing) {
        return res.status(404).json({ error: "Amenity not found" });
      }

      await AmenityService.removeAmenity(amenityId);

      res.status(200).json({
        message: "Amenity deleted successfully",
        deletedAmenity: existing.name,
      });
    } catch (error) {
      console.error("Error deleting amenity:", error);
      res
        .status(500)
        .json({ error: "Internal server error while deleting amenity" });
    }
  },
};
