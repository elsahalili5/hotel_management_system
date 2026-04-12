import { Request, Response } from "express";
import { AuthService } from "./auth.service.ts";
import { refreshAccessToken } from "../../services/refreshTokenService.ts";
import { LoginUserInput, RegisterUserInput } from "./auth.types.ts";
import { TypedRequestBody } from "../../lib/types.ts";

export const AuthController = {
  registerUser: async (
    req: TypedRequestBody<RegisterUserInput>,
    res: Response,
  ) => {
    try {
      const user = await AuthService.registerUser(req.body);

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

  loginUser: async (req: TypedRequestBody<LoginUserInput>, res: Response) => {
    try {
      const { email, password } = req.body;

      const result = await AuthService.loginUser({
        email: email,
        password: password,
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
