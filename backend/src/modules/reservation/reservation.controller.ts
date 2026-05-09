import { Request, Response } from "express";
import { AuthRequest } from "@lib/types.ts";
import { ReservationService } from "./reservation.service.ts";

export const ReservationController = {
  checkAvailability: async (req: Request, res: Response) => {
    try {
      const data = await ReservationService.checkAvailability({
        room_type_id:   Number(req.query.room_type_id),
        check_in_date:  new Date(req.query.check_in_date as string),
        check_out_date: new Date(req.query.check_out_date as string),
      });
      res.status(200).json({ data });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to check availability" });
    }
  },

  // Guest self-booking
  createReservation: async (req: AuthRequest, res: Response) => {
    try {
      const data = await ReservationService.createReservationAsGuest(req.body, req.user!.id);
      res.status(201).json({ data });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to create reservation" });
    }
  },

  // Staff processes checkout and payment
  checkout: async (req: AuthRequest, res: Response) => {
    try {
      const reservationId = Number(req.params.id);
      const data = await ReservationService.checkout(reservationId, req.body);
      res.status(200).json({ data });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to process checkout" });
    }
  },
};