import { z } from "zod";
import {
  createCleaningTaskSchema,
  updateCleaningTaskStatusSchema,
  cleaningTaskIdSchema,
  getCleaningTasksQuerySchema,
} from "./cleaningTask.schema.ts";
import type { TaskStatus, RoomStatus, Shift } from "@generated/prisma/enums.ts";

export type CreateCleaningTaskInput = z.infer<typeof createCleaningTaskSchema>;
export type UpdateCleaningTaskStatusInput = z.infer<typeof updateCleaningTaskStatusSchema>;
export type CleaningTaskIdParam = z.infer<typeof cleaningTaskIdSchema>;
export type GetCleaningTasksQuery = z.infer<typeof getCleaningTasksQuerySchema>;

export type CleaningTaskResponse = {
  id: number
  status: TaskStatus
  due_date: string | null
  notes: string | null
  assigned_at: string
  finished_at: string | null
  room: {
    id: number
    room_number: string
    floor: number
    status: RoomStatus
  }
  staff: {
    id: number
    shift: Shift
    user: { id: number; first_name: string; last_name: string; email: string }
  }
  assigned_by: { id: number; first_name: string; last_name: string }
}
