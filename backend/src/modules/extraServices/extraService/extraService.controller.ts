import { Response } from "express";
import { TypedRequest } from "@lib/types.ts";
import { ExtraServiceService } from "./extraService.service.ts";
import {
  CreateExtraServiceInput,
  UpdateExtraServiceInput,
  ExtraServiceIdParam,
} from "./extraService.types.ts";

export const ExtraServiceController = {
  getExtraServices: async (_req: TypedRequest, res: Response) => {
    try {
      const services = await ExtraServiceService.getAllExtraServices();
      return res.status(200).json(services);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to fetch extra services" });
    }
  },

  getExtraServiceById: async (
    req: TypedRequest<unknown, ExtraServiceIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      const service = await ExtraServiceService.getExtraServiceById(id);
      return res.status(200).json(service);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to fetch extra service" });
    }
  },

  createExtraService: async (
    req: TypedRequest<CreateExtraServiceInput>,
    res: Response,
  ) => {
    try {
      const service = await ExtraServiceService.createExtraService(req.body);
      return res.status(201).json(service);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to create extra service" });
    }
  },

  updateExtraService: async (
    req: TypedRequest<UpdateExtraServiceInput, ExtraServiceIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      const service = await ExtraServiceService.updateExtraService(id, req.body);
      return res.status(200).json(service);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to update extra service" });
    }
  },

  deleteExtraService: async (
    req: TypedRequest<unknown, ExtraServiceIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      await ExtraServiceService.deleteExtraService(id);
      return res.status(200).json({ message: "Extra service deleted successfully" });
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to delete extra service" });
    }
  },
};
