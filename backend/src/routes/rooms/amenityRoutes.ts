import { Router } from "express";
import { AmenityController } from "../../controllers/rooms/amenityController";

const router = Router();

router.get("/", AmenityController.getAmenities);
router.post("/", AmenityController.createAmenity);
router.put("/", AmenityController.editAmenity);
router.delete("/", AmenityController.deleteAmenity);

export default router;