// import { User } from "../generated/prisma/client.ts";3
// import { prisma } from "../lib/prisma.ts";
// import { Request, Response } from "express";

// export const getUsers = async (req, res) => {
//   const users: User[] = await prisma.user.findMany();
//   res.json(users);
// };

// export const getUserById = async (req: Request, res: Response) => {
//   const userIdParam = req.query.userId;

//   if (!userIdParam) {
//     return res.json({
//       error: "No id was given!",
//       status: 400,
//     });
//   }
//   const userId = Number(userIdParam);
//   const user = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });

//   if (user) {
//     res.json(user);
//   } else {
//     res.json({
//       error: "User not found!",
//       status: 400,
//     });
//   }
// };

// export const createUser = async (req: Request, res: Response) => {
//   const { first_name, last_name, email, password_hash } = req.body;
//   const user = await prisma.user.create({ data: { first_name, last_name, email, password_hash } });
//   res.json(user);
// };

// export const deleteUserById = async (req: Request, res: Response) => {
//   const userIdParam = req.query.userId;

//   if (!userIdParam) {
//     return res.json({
//       error: "No id was given!",
//       status: 400,
//     });
//   }

//   const userId = Number(userIdParam);
//   const User = await prisma.user.delete({
//     where: {
//       id: userId,
//     },
//   });

//   res.json(User);
// };
// userController.ts
import { prisma } from "../lib/prisma.ts";
import { Request, Response } from "express";

// ---- GET ALL USERS ----
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ---- GET USER BY ID ----
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userIdParam = req.query.userId;
    if (!userIdParam) return res.status(400).json({ error: "No userId given" });

    const userId = Number(userIdParam);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
