import { z } from "zod";
import { createReviewSchema, reviewIdParamSchema } from "./review.schema";

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ReviewIdParam = z.infer<typeof reviewIdParamSchema>;

export type ReviewResponse = {
  id: number;
  reservation_id: number;
  rating: number;
  title: string | null;
  comment: string | null;
  is_approved: boolean;
  created_at: Date;
  guest: {
    id: number;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  reservation: {
    id: number;
    room: {
      room_number: string;
    };
  };
};
