import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.ts";
import * as RoomTypeService from "../../services/rooms/roomTypeService.ts";


export const getRoomTypes = async (req: Request, res: Response) => {
  try {
    const types = await RoomTypeService.getAllRoomTypes();
    res.status(200).json(types);
  } catch (error) {
    console.error("Error fetching room types:", error);
    res.status(500).json({ error: "Failed to fetch room types from database" });
  }
};

//get room type by id 
export const getRoomType = async (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "Room Type ID is required" });

    const type = await RoomTypeService.getRoomTypeById(id);
    if (!type) return res.status(404).json({ error: "Room type not found" });

    res.status(200).json(type);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new room type
export const createRoomType = async (req: Request, res: Response) => {
  try {
    const { name, description, base_price, max_occupancy, size_m2, amenities, beds, images } = req.body;

   
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required and cannot be empty" });
    }
    if (!base_price || base_price <= 0) {
      return res.status(400).json({ error: "Base price must be a positive number" });
    }
    if (!max_occupancy || max_occupancy <= 0) {
      return res.status(400).json({ error: "Max occupancy must be at least 1 person" });
    }

   
    const existingName = await prisma.roomType.findUnique({ where: { name: name.trim() } });
    if (existingName) {
      return res.status(409).json({ error: `A Room Type with the name '${name}' already exists` });
    }

   
    if (beds && beds.length > 0) {
      
      const bedDetails = await prisma.bed.findMany({
        where: { id: { in: beds.map((b: any) => b.bed_id) } }
      });

      const totalBedCapacity = beds.reduce((sum: number, b: any) => {
        const bedInfo = bedDetails.find(bd => bd.id === b.bed_id);
        return sum + (bedInfo ? bedInfo.capacity * (b.quantity || 1) : 0);
      }, 0);

      if (totalBedCapacity < max_occupancy) {
        return res.status(400).json({ 
          error: `Total bed capacity (${totalBedCapacity}) is insufficient for the room's max occupancy (${max_occupancy}).` 
        });
      }
    }

   
    const newType = await RoomTypeService.createRoomType({
      name: name.trim(),
      description,
      base_price: Number(base_price),
      max_occupancy: Number(max_occupancy),
      size_m2: size_m2 ? Number(size_m2) : undefined,
      amenities,
      beds,
      images
    });

    res.status(201).json({ message: "Room Type created successfully", data: newType });

  } catch (error: any) {
    console.error("Create error:", error);
    res.status(500).json({ error: "An error occurred while creating the Room Type. Please check your data." });
  }
};


export const editRoomType = async (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "ID is required for update" });

    
    const exists = await prisma.roomType.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ error: "Room Type not found" });

    const updated = await RoomTypeService.updateRoomType(id, req.body);
    res.status(200).json({ message: "Room Type updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Room Type" });
  }
};


export const deleteRoomType = async (req: Request, res: Response) => {
  try {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ error: "ID is required" });

    const exists = await prisma.roomType.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ error: "Room Type not found" });

    await RoomTypeService.removeRoomType(id);
    res.status(200).json({ message: `Room type '${exists.name}' deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: "Cannot delete this Room Type because it is linked to existing rooms." });
  }
};