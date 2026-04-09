import { User } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";
import { Request, Response } from "express";

export const getUsers = async (req, res) => {
  const users: User[] = await prisma.user.findMany();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const userIdParam = req.query.userId;

  if (!userIdParam) {
    return res.json({
      error: "No id was given!",
      status: 400,
    });
  }
  const userId = Number(userIdParam);
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user) {
    res.json(user);
  } else {
    res.json({
      error: "User not found!",
      status: 400,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, address } = req.body;
  const user = await prisma.user.create({ data: { name, email, address } });
  res.json(user);
};

export const deleteUserById = async (req: Request, res: Response) => {
  const userIdParam = req.query.userId;

  if (!userIdParam) {
    return res.json({
      error: "No id was given!",
      status: 400,
    });
  }

  const userId = Number(userIdParam);
  const User = await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  res.json(User);
};
