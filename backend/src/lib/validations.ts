import z from "zod";

export const numericStringSchema = z
  .string()
  .regex(/^[0-9]+$/, "Must be a numeric string");
