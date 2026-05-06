import { Request, Response } from "express";
import { CleaningTaskService } from "./cleaningTask.service.ts";
import {
  CreateCleaningTaskInput,
  UpdateCleaningTaskStatusInput,
  CleaningTaskIdParam,
} from "./cleaningTask.types.ts";
import { TypedRequest, AuthRequest } from "@lib/types.ts";

export const CleaningTaskController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      // Nuk dërgojmë asnjë parametër te Service
      const data = await CleaningTaskService.getAll();
      res.status(200).json({ data });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to fetch cleaning tasks" });
    }
  },

  getMyTasks: async (req: AuthRequest, res: Response) => {
    try {
      const data = await CleaningTaskService.getMyTasks(req.user!.id);
      res.status(200).json({ data });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to fetch your tasks" });
    }
  },

  create: async (req: AuthRequest & TypedRequest<CreateCleaningTaskInput>, res: Response) => {
    try {
      const data = await CleaningTaskService.create(req.body, req.user!.id);
      res.status(201).json({ message: "Cleaning task assigned successfully", data });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to create cleaning task" });
    }
  },

  updateStatus: async (
    req: AuthRequest & TypedRequest<UpdateCleaningTaskStatusInput, CleaningTaskIdParam>,
    res: Response,
  ) => {
    try {
      const id = Number(req.params.id);
      const roles = req.user!.user_roles.map((ur: any) => ur.role.name);
      const data = await CleaningTaskService.updateStatus(id, req.body, req.user!.id, roles);
      res.status(200).json({ message: "Task status updated successfully", data });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to update task status" });
    }
  },

  delete: async (req: TypedRequest<unknown, CleaningTaskIdParam>, res: Response) => {
    try {
      const id = Number(req.params.id);
      await CleaningTaskService.delete(id);
      res.status(200).json({ message: "Cleaning task deleted successfully" });
    } catch (error: any) {
      if (error.status) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: "Failed to delete cleaning task" });
    }
  },
};
