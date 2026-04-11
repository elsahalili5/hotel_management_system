import { Request, Response } from "express";
import { RoomTypeService } from "../../services/rooms/roomTypeService.ts";

export const RoomTypeController = {
  getRoomTypes: async (_req: Request, res: Response) => {
    try {
      const types = await RoomTypeService.getAllRoomTypes();
      res.status(200).json(types);
    } catch (error) {
      console.error("Error fetching room types:", error);
      res.status(500).json({ error: "Failed to fetch room types from database" });
    }
  },

  getRoomType: async (req: Request, res: Response) => {
    try {
      const id = Number(req.query.id);
      if (!id || isNaN(id)) return res.status(400).json({ error: "Room Type ID is required" });

      const type = await RoomTypeService.getRoomTypeById(id);
      if (!type) return res.status(404).json({ error: "Room type not found" });

      res.status(200).json(type);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  createRoomType: async (req: Request, res: Response) => {
    try {
      const { name, description, base_price, max_occupancy, size_m2, amenities, beds, images } = req.body;

      if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Name is required and cannot be empty" });
      }
      if (!base_price || Number(base_price) <= 0) {
        return res.status(400).json({ error: "Base price must be a positive number" });
      }
      if (!max_occupancy || Number(max_occupancy) <= 0) {
        return res.status(400).json({ error: "Max occupancy must be at least 1 person" });
      }

      const newType = await RoomTypeService.createRoomType({
        name: name.trim(),
        description,
        base_price: Number(base_price),
        max_occupancy: Number(max_occupancy),
        size_m2: size_m2 ? Number(size_m2) : undefined,
        amenities,
        beds,
        images,
      });

      res.status(201).json({ message: "Room Type created successfully", data: newType });
    } catch (error: any) {
      console.error("Create error:", error);
      const status = error.status ?? 500;
      const message = error.message ?? "An error occurred while creating the Room Type.";
      res.status(status).json({ error: message });
    }
  },

  editRoomType: async (req: Request, res: Response) => {
    try {
      const id = Number(req.query.id);
      if (!id || isNaN(id)) return res.status(400).json({ error: "ID is required for update" });

      const { name, base_price, max_occupancy } = req.body;

      if (name !== undefined && name.trim() === "") {
        return res.status(400).json({ error: "Name cannot be empty" });
      }
      if (base_price !== undefined && Number(base_price) <= 0) {
        return res.status(400).json({ error: "Base price must be a positive number" });
      }
      if (max_occupancy !== undefined && Number(max_occupancy) <= 0) {
        return res.status(400).json({ error: "Max occupancy must be at least 1 person" });
      }

      const exists = await RoomTypeService.getRoomTypeById(id);
      if (!exists) return res.status(404).json({ error: "Room Type not found" });

      const updated = await RoomTypeService.updateRoomType(id, {
        ...req.body,
        name: name !== undefined ? name.trim() : undefined,
      });
      res.status(200).json({ message: "Room Type updated successfully", data: updated });
    } catch (error: any) {
      console.error("Edit error:", error);
      const status = error.status ?? 500;
      const message = error.message ?? "Failed to update Room Type";
      res.status(status).json({ error: message });
    }
  },

  deleteRoomType: async (req: Request, res: Response) => {
    try {
      const id = Number(req.query.id);
      if (!id || isNaN(id)) return res.status(400).json({ error: "ID is required" });

      const exists = await RoomTypeService.getRoomTypeById(id);
      if (!exists) return res.status(404).json({ error: "Room Type not found" });

      await RoomTypeService.removeRoomType(id);
      res.status(200).json({ message: `Room type '${exists.name}' deleted successfully` });
    } catch (error: any) {
      console.error("Delete error:", error);
      const status = error.status ?? 500;
      const message = error.message ?? "Cannot delete this Room Type.";
      res.status(status).json({ error: message });
    }
  },
};
