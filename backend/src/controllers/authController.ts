import { User } from "../generated/prisma/client.ts"; // for typing only
import { prisma } from "../lib/prisma.ts";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// ---- REGISTER ----
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password_hash,
        status: "ACTIVE", // optional default
      },
    });

    res.status(201).json(user as User);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// ---- LOGIN ----
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    // Optional: generate JWT here if needed

    res.status(200).json({ message: "Login successful", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};
