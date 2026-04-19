import { ZodSchema } from "zod";
import { Request, Response, NextFunction, request } from "express";

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

    // e zevendeson vleren e request me versionin e validuar te tij, qe eshte result.data, dhe e vendos ne te njejten property (body, params, ose query) nga e cila e mori vleren origjinale.
    // Kjo ben qe ne pjesen tjeter te kodit, kur ne aksesojme req.body, req.params, ose req.query, te kemi versionin e validuar
    //  dhe te tipizuar sipas skemes qe kemi definuar me Zod.
    req[source] = result.data;

    next();
  };
