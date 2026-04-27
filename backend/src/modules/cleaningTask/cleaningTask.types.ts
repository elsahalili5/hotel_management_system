import { z } from "zod";
import {
  createCleaningTaskSchema,
  updateCleaningTaskStatusSchema,
  cleaningTaskIdSchema,
  getCleaningTasksQuerySchema,
} from "./cleaningTask.schema.ts";

export type CreateCleaningTaskInput = z.infer<typeof createCleaningTaskSchema>;
export type UpdateCleaningTaskStatusInput = z.infer<typeof updateCleaningTaskStatusSchema>;
export type CleaningTaskIdParam = z.infer<typeof cleaningTaskIdSchema>;
export type GetCleaningTasksQuery = z.infer<typeof getCleaningTasksQuerySchema>;
