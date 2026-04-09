import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.ts";
import * as AmenityService from "../../services/rooms/amenityService.ts";

// ---- GET ALL AMENITIES ----
export const getAmenities = async (req: Request, res: Response) => {
  try {
    const data = await AmenityService.getAllAmenities();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching amenities:", error);
    res.status(500).json({ error: "Internal server error while fetching amenities" });
  }
};

// ---- CREATE NEW AMENITY ----
export const createAmenity = async (req: Request, res: Response) => {
  try {
    const { name, icon } = req.body;

    // Validation: Name is mandatory
    if (!name) {
      return res.status(400).json({ error: "Amenity name is required" });
    }

    const newAmenity = await AmenityService.createNewAmenity(name, icon);
    res.status(201).json(newAmenity);
  } catch (error) {
    console.error("Error creating amenity:", error);
    res.status(500).json({ error: "Internal server error while creating amenity" });
  }
};

// ---- UPDATE EXISTING AMENITY ----
export const editAmenity = async (req: Request, res: Response) => {
  try {
    const idParam = req.query.id;
    const { name, icon } = req.body;

    if (!idParam) {
      return res.status(400).json({ error: "Missing amenity ID in query parameters" });
    }

    const amenityId = Number(idParam);

    
    const existing = await prisma.amenity.findUnique({ where: { id: amenityId } });
    if (!existing) {
      return res.status(404).json({ error: "Amenity not found" });
    }

    const updated = await AmenityService.updateAmenity(amenityId, name, icon);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating amenity:", error);
    res.status(500).json({ error: "Internal server error while updating amenity" });
  }
};

// ---- DELETE AMENITY ----
export const deleteAmenity = async (req: Request, res: Response) => {
  try {
    const idParam = req.query.id;

    if (!idParam) {
      return res.status(400).json({ error: "Missing amenity ID in query parameters" });
    }

    const amenityId = Number(idParam);

    // Verify existence before deletion attempt
    const existingAmenity = await prisma.amenity.findUnique({
      where: { id: amenityId },
    });

    if (!existingAmenity) {
      return res.status(404).json({ error: "Amenity not found" });
    }

    await AmenityService.removeAmenity(amenityId);

    res.status(200).json({ 
      message: "Amenity deleted successfully", 
      deletedAmenity: existingAmenity.name 
    });
  } catch (error) {
    console.error("Error deleting amenity:", error);
    res.status(500).json({ error: "Internal server error while deleting amenity" });
  }
};