import { Router } from 'express';
import * as RoomController from "../../controllers/rooms/roomController.ts";

const router = Router();

router.post('/', RoomController.createRoom);
router.get('/', RoomController.getAllRooms);
router.get('/stats', RoomController.getStats);
router.get('/available', RoomController.getAvailableRooms);
router.get('/:id', RoomController.getRoomById);
router.put('/:id', RoomController.updateRoom);
router.delete('/:id', RoomController.deleteRoom);
router.patch('/:id/status', RoomController.updateStatus);


export default router;