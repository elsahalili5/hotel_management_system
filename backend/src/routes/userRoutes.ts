// import express from "express";
// import {
//   getUsers,
//   createUser,
//   getUserById,
//   deleteUserById
// } from "../controllers/userController.ts";
// const router = express.Router();

// router.get("/", getUsers);
// router.get("/id", getUserById);
// router.post("/", createUser);
// router.delete("/", deleteUserById);

// export default router;
import express from "express";
import { getUsers, getUserById } from "../controllers/userController.ts";
const router = express.Router();

router.get("/", getUsers);
router.get("/id", getUserById);

export default router;
