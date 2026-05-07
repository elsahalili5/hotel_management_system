import { Request, Response } from "express";
import { ServiceCategoryService } from "./serviceCategory.service.ts";
import { TypedRequest } from "@lib/types.ts";
import { CreateServiceCategoryInput, UpdateServiceCategoryInput, ServiceCategoryIdParam } from "./serviceCategory.types.ts";

export const ServiceCategoryController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await ServiceCategoryService.getAll();
      res.status(200).json({ data });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to fetch service categories" });
    }
  },

  getById: async (req: TypedRequest<unknown, ServiceCategoryIdParam>, res: Response) => {
    try {
      const data = await ServiceCategoryService.getById(Number(req.params.id));
      res.status(200).json({ data });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to fetch service category" });
    }
  },

  create: async (req: TypedRequest<CreateServiceCategoryInput>, res: Response) => {
    try {
      const data = await ServiceCategoryService.create(req.body);
      res.status(201).json({ message: "Service category created successfully", data });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to create service category" });
    }
  },

  update: async (req: TypedRequest<UpdateServiceCategoryInput, ServiceCategoryIdParam>, res: Response) => {
    try {
      const data = await ServiceCategoryService.update(Number(req.params.id), req.body);
      res.status(200).json({ message: "Service category updated successfully", data });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to update service category" });
    }
  },

  delete: async (req: TypedRequest<unknown, ServiceCategoryIdParam>, res: Response) => {
    try {
      await ServiceCategoryService.delete(Number(req.params.id));
      res.status(200).json({ message: "Service category deleted successfully" });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to delete service category" });
    }
  },
};