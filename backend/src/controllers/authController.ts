import { Request, Response } from "express";
import { AuthService } from "../services/authService.ts";
import { refreshAccessToken } from "../services/refreshTokenService.ts";

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

      res.status(201).json({
        message: "User registered as GUEST",
        user,
      });
    } catch (error: any) {
      console.error(error);
      res.status(error.status ?? 500).json({
        error: error.message ?? "Registration failed",
      });
    }
  },

  loginUser: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const result = await AuthService.loginUser({ email, password });

      res.status(200).json({
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      res.status(error.status ?? 500).json({
        error: error.message ?? "Login failed",
      });
    }
  },

  // 🔁 REFRESH TOKEN
  refreshToken: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token required" });
      }

      const result = await refreshAccessToken(refreshToken);

      res.status(200).json({
        message: "Token refreshed",
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      res.status(error.status ?? 500).json({
        error: error.message ?? "Token refresh failed",
      });
    }
  },

  // 🚪 LOGOUT
  logoutUser: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token required" });
      }

      const result = await AuthService.logoutUser(refreshToken);

      res.status(200).json({
        message: "Logged out successfully",
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      res.status(error.status ?? 500).json({
        error: error.message ?? "Logout failed",
      });
    }
  },
};
