import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  // createStaff,
} from "../controllers/userController.ts";

const router = express.Router();
// router.post("/", createStaff);
router.get("/", getUsers);
router.get("/:userId", getUserById);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;
