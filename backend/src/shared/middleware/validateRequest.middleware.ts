import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

type RequestPart = "body" | "params" | "query";

export const validateRequestMiddleware =
  <T>(schema: ZodSchema<T>, source: RequestPart = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.flatten(),
      });
    }

    if (source === "query") {
      Object.defineProperty(req, "query", { value: result.data, writable: true, configurable: true });
    } else {
      req[source] = result.data as any;
    }

    next();
  };