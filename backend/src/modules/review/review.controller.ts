import { Response } from "express";
import { AuthRequest, TypedRequest } from "@lib/types.ts";
import { ReviewService } from "./review.service.ts";
import { CreateReviewInput, ReviewIdParam } from "./review.types.ts";
import { prisma } from "../../lib/prisma.ts";

export const ReviewController = {
  getAll: async (_req: AuthRequest, res: Response) => {
    try {
      const reviews = await ReviewService.getAllReviews();
      return res.status(200).json(reviews);
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      return res.status(500).json({ error: "Failed to fetch reviews" });
    }
  },

  create: async (req: TypedRequest<CreateReviewInput>, res: Response) => {
    try {
      const guestProfile = await prisma.guest.findUnique({
        where: { user_id: (req as AuthRequest).user!.id },
      });
      if (!guestProfile) return res.status(403).json({ error: "No guest profile" });

      const review = await ReviewService.createReview(guestProfile.id, req.body);
      return res.status(201).json(review);
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      return res.status(500).json({ error: "Failed to create review" });
    }
  },

  approve: async (req: TypedRequest<{ is_approved: boolean }, ReviewIdParam>, res: Response) => {
    try {
      const review = await ReviewService.approveReview(req.params.id, req.body.is_approved);
      return res.status(200).json(review);
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      return res.status(500).json({ error: "Failed to update review" });
    }
  },

  remove: async (req: TypedRequest<unknown, ReviewIdParam>, res: Response) => {
    try {
      await ReviewService.deleteReview(req.params.id);
      return res.status(204).send();
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      return res.status(500).json({ error: "Failed to delete review" });
    }
  },
};
