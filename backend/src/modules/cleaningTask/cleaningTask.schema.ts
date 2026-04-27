import { z } from "zod";
import { TaskStatus } from "@generated/prisma/enums.ts";
import { numericStringSchema } from "@lib/validations";

export const cleaningTaskIdSchema = z.object({
  id: numericStringSchema,
});

export const createCleaningTaskSchema = z.object({
  room_id: z.coerce
    .number({ message: "Room ID must be a number" })
    .int()
    .positive("Room ID must be a positive number"),

  staff_id: z.coerce
    .number({ message: "Staff ID must be a number" })
    .int()
    .positive("Staff ID must be a positive number"),

  due_date: z.coerce.date({ message: "due_date must be a valid date" }).optional(),

  notes: z.string().trim().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const updateCleaningTaskStatusSchema = z.object({
  status: z.enum(TaskStatus),
});

export const getCleaningTasksQuerySchema = z.object({
  status: z.enum(TaskStatus).optional(),
});
