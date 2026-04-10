import { Router } from "express";
import { BedController } from "../../controllers/rooms/bedController.ts";

const router = Router();

router.get("/", BedController.getBeds);
router.post("/", BedController.createBed);
router.put("/", BedController.editBed);
router.delete("/", BedController.deleteBed);

export default router;