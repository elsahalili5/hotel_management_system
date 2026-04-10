import { Request, Response } from "express";
import { AuthService } from "../services/authService.ts";

export const AuthController = {
  registerUser: async (req: Request, res: Response) => {
    try {
      const { first_name, last_name, email, password } = req.body;

      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const user = await AuthService.registerUser({
        first_name,
        last_name,
        email,
        password,
      });

      res.status(201).json({ message: "User registered as GUEST", user });
    } catch (error: any) {
      console.error(error);
      const status = error.status ?? 500;
      const message = error.message ?? "Registration failed";
      res.status(status).json({ error: message });
    }
  },

  loginUser: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const userLoginResponse = await AuthService.loginUser({
        email,
        password,
      });

      res
        .status(200)
        .json({ message: "Login successful", data: userLoginResponse });
    } catch (error: any) {
      console.error(error);
      const status = error.status ?? 500;
      const message = error.message ?? "Login failed";
      res.status(status).json({ error: message });
    }
  },
};
