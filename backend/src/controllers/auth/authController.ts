import { Request, Response } from "express";
import { AuthService } from "../../services/authService.ts";
import { refreshAccessToken } from "../../services/refreshTokenService.ts";

export const AuthController = {
  registerUser: async (req: Request, res: Response) => {
    try {
      const { first_name, last_name, email, password } = req.body;

      if (
        typeof first_name !== "string" ||
        typeof last_name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
      ) {
        return res.status(400).json({ error: "Invalid input" });
      }

      if (
        !first_name.trim() ||
        !last_name.trim() ||
        !email.trim() ||
        !password.trim()
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      if (password.trim().length < 8 || password.trim().length > 72) {
        return res
          .status(400)
          .json({ error: "Password must be between 8 and 72 characters" });
      }

      const user = await AuthService.registerUser({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      res.status(201).json({
        message: "User registered as GUEST",
        user,
      });
    } catch (error: any) {
      console.error(error);
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  },

  loginUser: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Invalid input" });
      }

      if (!email.trim() || !password.trim()) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const result = await AuthService.loginUser({
        email: email.trim(),
        password: password.trim(),
      });

      res.status(200).json({
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({ error: "Login failed" });
    }
  },

  refreshToken: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      if (typeof refreshToken !== "string" || !refreshToken.trim()) {
        return res.status(400).json({ error: "Refresh token required" });
      }

      const result = await refreshAccessToken(refreshToken);

      res.status(200).json({
        message: "Token refreshed",
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({ error: "Token refresh failed" });
    }
  },

  // 🚪 LOGOUT
  logoutUser: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      if (typeof refreshToken !== "string" || !refreshToken.trim()) {
        return res.status(400).json({ error: "Refresh token required" });
      }

      const result = await AuthService.logoutUser(refreshToken);

      res.status(200).json(result);
    } catch (error: any) {
      console.error(error);
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({ error: "Logout failed" });
    }
  },
};
