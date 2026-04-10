import { Router } from "express";
import { RoomTypeController } from "../../controllers/rooms/roomTypeController.ts";

const router = Router();

router.get("/", RoomTypeController.getRoomTypes);
router.get("/detail", RoomTypeController.getRoomType);
router.post("/", RoomTypeController.createRoomType);
router.put("/", RoomTypeController.editRoomType);
router.delete("/", RoomTypeController.deleteRoomType);

export default router;
