import { z } from "zod";

export const createReviewSchema = z.object({
  reservation_id: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().optional(),
  comment: z.string().trim().optional(),
});

export const reviewIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});
