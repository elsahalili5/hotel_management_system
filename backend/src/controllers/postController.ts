import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
  const posts = await prisma.post.findMany({ include: { author: true } });
  res.json(posts);
};

export const createPost = async (req, res) => {
  const { title, content, authorId } = req.body;
  const post = await prisma.post.create({ data: { title, content, authorId } });
  res.json(post);
};
