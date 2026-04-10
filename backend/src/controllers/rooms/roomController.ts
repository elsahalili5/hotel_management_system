import { Request, Response } from 'express';
import * as RoomService from "../../services/rooms/roomService.ts";
import { RoomStatus } from "../../generated/prisma/enums.ts";


export const createRoom = async (req: Request, res: Response) => {
  try {
    const { room_number, floor, room_type_id } = req.body;

    
    if (!room_number || floor === undefined || !room_type_id) {
      return res.status(400).json({ 
        success: false, 
        message: "All fileds are required" 
      });
    }

    const room = await RoomService.createRoom({ room_number, floor, room_type_id });
    
    return res.status(201).json({
      success: true,
      data: room
    });
  } catch (error: any) {
    // Exsisting room number
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: "This room number already exists." });
    }
    return res.status(500).json({ success: false, message: "An error occurred while creating the Room. Please check your data." });
  }
};


export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const { floor, status, room_type_id } = req.query;

    const filters = {
  floor: (floor && !isNaN(Number(floor))) ? Number(floor) : undefined,
  status: status as RoomStatus,
  room_type_id: (room_type_id && !isNaN(Number(room_type_id))) ? Number(room_type_id) : undefined
};

    const rooms = await RoomService.getAllRooms(filters);
    return res.status(200).json({ success: true, data: rooms });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch rooms." });
  }
};


export const getRoomById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID should be a valid number." });
    }

    const room = await RoomService.getRoomById(id);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room was not found." });
    }

    return res.status(200).json({ success: true, data: room });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch room." });
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "ID should be a valid number." });

    const updatedRoom = await RoomService.updateRoom(id, req.body);
    return res.status(200).json({ success: true, data: updatedRoom });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: "Room does not exist." });
    }
    return res.status(500).json({ success: false, message: "Failed to update the room." });
  }
};


export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "ID should be a valid number." });

    await RoomService.deleteRoom(id);
    return res.status(200).json({ success: true, message: "Room was deleted successfully." });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: "Room was not found." });
    }
    return res.status(500).json({ success: false, message: "Failed to delete room."});
  }
};


export const updateStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    
    if (!Object.values(RoomStatus).includes(status)) {
      return res.status(400).json({ success: false, message: "The status does not exsist." });
    }

    const room = await RoomService.updateRoomStatus(id, status);
    return res.status(200).json({ success: true, data: room });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to update status." });
  }
};


export const getStats = async (_req: Request, res: Response) => {
  try {
    const stats = await RoomService.getRoomStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch stats."});
  }
};

export const getAvailableRooms = async (req: Request, res: Response) => {
  try {
   
    const { typeId } = req.query;

    const typeIdNum = typeId ? Number(typeId) : undefined;

    
    if (typeId && isNaN(Number(typeId))) {
      return res.status(400).json({ 
        success: false, 
        message: "typeId should be a valid number." 
      });
    }

    const rooms = await RoomService.getAvailableRooms(typeIdNum);

    return res.status(200).json({ 
      success: true, 
      count: rooms.length,
      data: rooms 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch available rooms." 
    });
  }
};