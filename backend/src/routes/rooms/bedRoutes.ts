import { Router } from "express";
import { getBeds, createBed, editBed, deleteBed } from "../../controllers/rooms/bedController.ts";

const router = Router();

router.get("/", getBeds);
router.post("/", createBed);
router.put("/", editBed); // Shtohet kjo linjë
router.delete("/", deleteBed);

export default router;