import { z } from "zod";

export const userRegisterSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  email: z.email("Invalid email format").trim(),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});

export const userLoginSchema = z.object({
  email: z.email("Invalid email format").trim(),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(1, "Refresh token required"),
});

export const logoutSchema = z.object({
  refreshToken: z.string().trim().min(10, "Invalid refresh token"),
});
