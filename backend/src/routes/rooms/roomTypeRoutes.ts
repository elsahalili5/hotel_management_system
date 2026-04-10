import { Router } from "express";
import {
  getRoomTypes,
  getRoomType,
  createRoomType,
  editRoomType,
  deleteRoomType,
} from "../../controllers/rooms/roomTypeController.ts";

const router = Router();

router.get("/", getRoomTypes);
router.get("/detail", getRoomType);
router.post("/", createRoomType);
router.put("/", editRoomType);
router.delete("/", deleteRoomType);

export default router;
