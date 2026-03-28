import express from "express";
import { getPosts, createPost } from "../controllers/postController.ts";
const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);

export default router;
