import { Request, Response } from "express";
import { AuthService } from "./auth.service.ts";
import {
  LoginUserInput,
  RegisterUserInput,
  RefreshTokenInput,
  LogoutInput,
} from "./auth.types.ts";
import { TypedRequest } from "@lib/types.ts";

export const AuthController = {
  registerUser: async (req: TypedRequest<RegisterUserInput>, res: Response) => {
    try {
      const user = await AuthService.registerUser(req.body);

      return res.status(201).json({
        message: "User registered as GUEST",
        data: user,
      });
    } catch (error: any) {
      console.error(error);

      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }

      return res.status(500).json({ error: "Registration failed" });
    }
  },
  loginUser: async (req: TypedRequest<LoginUserInput>, res: Response) => {
    try {
      const result = await AuthService.loginUser(req.body);

      return res.status(200).json({
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      console.error(error);

      const status = error?.status || 500;
      const message = error?.message || "Login failed";

      return res.status(status).json({ error: message });
    }
  },
  refreshToken: async (req: TypedRequest<RefreshTokenInput>, res: Response) => {
    try {
      const result = await AuthService.refreshAccessToken(req.body);

      return res.status(200).json({
        message: "Token refreshed",
        data: result,
      });
    } catch (error: any) {
      console.error(error);

      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }

      return res.status(500).json({
        error: "Token refresh failed",
      });
    }
  },

  logoutUser: async (req: TypedRequest<LogoutInput>, res: Response) => {
    try {
      const result = await AuthService.logoutUser(req.body);

      return res.status(200).json({
        message: result.message,
      });
    } catch (error: any) {
      console.error(error);

      if (error.status) {
        return res.status(error.status).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: "Logout failed",
      });
    }
  },
};
