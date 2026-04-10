import { Request, Response } from "express";
import {
  getAllGuestsService,
  getGuestByIdService,
  updateGuestProfile,
} from "../services/guestService.ts";
import * as staffService from "../services/staffService.ts";

export const getGuests = async (req: Request, res: Response) => {
  try {
    const guests = await getAllGuestsService();
    res.status(200).json(guests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch guests" });
  }
};

export const getGuestById = async (req: Request, res: Response) => {
  try {
    const guestIdParam = req.params.id;
    if (!guestIdParam)
      return res.status(400).json({ error: "No guestId given" });

    const guestId = Number(guestIdParam);
    const guest = await getGuestByIdService(guestId);

    res.status(200).json(guest);
  } catch (error: any) {
    console.error(error);
    const status = error.status ?? 500;
    const message = error.message ?? "Failed to fetch guest";
    res.status(status).json({ error: message });
  }
};

export const updateGuest = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const {
      phone_number,
      address,
      city,
      country,
      passport_number,
      date_of_birth,
    } = req.body;

    const updatedGuest = await updateGuestProfile(
      id,
      phone_number,
      address,
      city,
      country,
      passport_number,
      date_of_birth ? new Date(date_of_birth) : undefined,
    );

    res.status(200).json(updatedGuest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating guest" });
  }
};
