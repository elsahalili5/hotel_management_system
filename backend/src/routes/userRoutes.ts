import { Router } from "express";
import { UserController } from "../controllers/userController.ts";

const router = Router();

router.post("/guest", UserController.createGuest);
router.post("/staff", UserController.createStaff);

router.get("/", UserController.getUsers);
router.get("/:userId", UserController.getUserById);

router.put("/:userId", UserController.updateUser);

router.delete("/:userId", UserController.deleteUser);

export default router;
