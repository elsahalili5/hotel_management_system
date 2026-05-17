import { prisma } from "../../lib/prisma.ts";
import { CreateReviewInput } from "./review.types";

const throwError = (status: number, message: string): never => {
  throw { status, message };
};

const reviewInclude = {
  guest: {
    select: {
      id: true,
      user: {
        select: { first_name: true, last_name: true, email: true },
      },
    },
  },
  reservation: {
    select: {
      id: true,
      room: { select: { room_number: true } },
    },
  },
};

export const ReviewService = {
  getAllReviews: async () => {
    return prisma.review.findMany({
      include: reviewInclude,
      orderBy: { created_at: "desc" },
    });
  },

  createReview: async (guestId: number, data: CreateReviewInput) => {
    const reservation = await prisma.reservation.findUnique({
      where: { id: data.reservation_id },
      select: { guest_id: true, status: true },
    });

    if (!reservation) throwError(404, "Reservation not found");
    if (reservation!.guest_id !== guestId) throwError(403, "Forbidden");
    if (reservation!.status !== "CHECKED_OUT") {
      throwError(400, "Can only review after checkout");
    }

    const existing = await prisma.review.findUnique({
      where: { reservation_id: data.reservation_id },
    });
    if (existing) throwError(409, "Review already exists for this reservation");

    return prisma.review.create({
      data: { guest_id: guestId, ...data },
      include: reviewInclude,
    });
  },

  approveReview: async (id: number, is_approved: boolean) => {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) throwError(404, "Review not found");

    return prisma.review.update({
      where: { id },
      data: { is_approved },
      include: reviewInclude,
    });
  },

  deleteReview: async (id: number) => {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) throwError(404, "Review not found");
    return prisma.review.delete({ where: { id } });
  },
};
