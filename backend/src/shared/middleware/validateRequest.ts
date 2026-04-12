// middlewares/validate.ts
import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.flatten(),
      });
    }

    // overwrite req.body with validated + typed data
    req.body = result.data;

    next();
  };
