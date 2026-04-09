import { Router } from "express";
import { getAmenities, createAmenity, deleteAmenity, editAmenity } from "../../controllers/rooms/amenityController";

const router = Router();

router.get("/", getAmenities);      // GET /api/amenities
router.post("/", createAmenity);    // POST /api/amenities
router.put("/", editAmenity);    // PUT /api/amenities
router.delete("/", deleteAmenity);  // DELETE /api/amenities?id=1

export default router;