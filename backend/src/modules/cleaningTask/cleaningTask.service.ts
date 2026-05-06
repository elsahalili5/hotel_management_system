import { prisma } from "@lib/prisma.ts";
import { TaskStatus, RoomStatus } from "@generated/prisma/enums.ts";
import { CreateCleaningTaskInput, UpdateCleaningTaskStatusInput } from "./cleaningTask.types.ts";

const ERRORS = {
  NOT_FOUND: { status: 404, message: "Cleaning task not found" },
  ROOM_NOT_FOUND: { status: 404, message: "Room not found" },
  STAFF_NOT_FOUND: { status: 404, message: "Staff member not found" },
  ROOM_NOT_DIRTY: { status: 400, message: "Room must have DIRTY status to assign a cleaning task" },
  NOT_HOUSEKEEPING: { status: 400, message: "Assigned staff member must have the HOUSEKEEPING role" },
  NOT_YOUR_TASK: { status: 403, message: "You can only update your own assigned tasks" },
  INVALID_TRANSITION: (from: string, to: string) => ({
    status: 400,
    message: `Cannot change task status from ${from} to ${to}`,
  }),
};

const ALLOWED_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.PENDING]:     [TaskStatus.IN_PROGRESS],
  [TaskStatus.IN_PROGRESS]: [TaskStatus.COMPLETED],
  [TaskStatus.COMPLETED]:   [],
};

const taskSelect = {
  id: true,
  status: true,
  due_date: true,
  notes: true,
  assigned_at: true,
  finished_at: true,
  room: {
    select: { id: true, room_number: true, floor: true, status: true },
  },
  staff: {
    select: {
      id: true,
      shift: true,
      user: { select: { id: true, first_name: true, last_name: true, email: true } },
    },
  },
  assigned_by: {
    select: { id: true, first_name: true, last_name: true },
  },
};

export const CleaningTaskService = {
  getAll: async () => {
    return await prisma.cleaningTask.findMany({
      orderBy: { assigned_at: "desc" },
      select: taskSelect,
    });
  },

  getMyTasks: async (userId: number) => {
    const staff = await prisma.staff.findUnique({ where: { user_id: userId } });
    if (!staff) throw ERRORS.STAFF_NOT_FOUND;

    return await prisma.cleaningTask.findMany({
      where: { staff_id: staff.id },
      orderBy: { due_date: "asc" },
      select: taskSelect,
    });
  },

  create: async (data: CreateCleaningTaskInput, assignedById: number) => {
    const room = await prisma.room.findUnique({ where: { id: data.room_id } });
    if (!room) throw ERRORS.ROOM_NOT_FOUND;
    if (room.status !== RoomStatus.DIRTY) throw ERRORS.ROOM_NOT_DIRTY;

    const staff = await prisma.staff.findUnique({
      where: { id: data.staff_id },
      include: { user: { include: { user_roles: { include: { role: true } } } } },
    });
    if (!staff) throw ERRORS.STAFF_NOT_FOUND;

    const isHousekeeping = staff.user.user_roles.some(
      (ur) => ur.role.name === "HOUSEKEEPING",
    );
    if (!isHousekeeping) throw ERRORS.NOT_HOUSEKEEPING;

    const [task] = await prisma.$transaction([
      prisma.cleaningTask.create({
        data: {
          room_id: data.room_id,
          staff_id: data.staff_id,
          assigned_by_id: assignedById,
          due_date: data.due_date,
          notes: data.notes,
        },
        select: taskSelect,
      }),
      prisma.room.update({
        where: { id: data.room_id },
        data: { status: RoomStatus.CLEANING },
      }),
    ]);

    return task;
  },

  updateStatus: async (
    id: number,
    data: UpdateCleaningTaskStatusInput,
    userId: number,
    userRoles: string[],
  ) => {
    const task = await prisma.cleaningTask.findUnique({ where: { id } });
    if (!task) throw ERRORS.NOT_FOUND;

    if (userRoles.includes("HOUSEKEEPING")) {
      const staff = await prisma.staff.findUnique({ where: { user_id: userId } });
      if (!staff || task.staff_id !== staff.id) throw ERRORS.NOT_YOUR_TASK;
    }

    const allowed = ALLOWED_TRANSITIONS[task.status];
    if (!allowed.includes(data.status)) {
      throw ERRORS.INVALID_TRANSITION(task.status, data.status);
    }

    const isCompleted = data.status === TaskStatus.COMPLETED;

    const [updated] = await prisma.$transaction([
      prisma.cleaningTask.update({
        where: { id },
        data: {
          status: data.status,
          finished_at: isCompleted ? new Date() : null,
        },
        select: taskSelect,
      }),
      ...(isCompleted
        ? [prisma.room.update({
            where: { id: task.room_id },
            data: { status: RoomStatus.AVAILABLE },
          })]
        : []),
    ]);

    return updated;
  },

  delete: async (id: number) => {
    const task = await prisma.cleaningTask.findUnique({
      where: { id },
      include: { room: true },
    });
    if (!task) throw ERRORS.NOT_FOUND;

    await prisma.$transaction([
      prisma.cleaningTask.delete({ where: { id } }),
      ...(task.room.status === RoomStatus.CLEANING
        ? [prisma.room.update({ where: { id: task.room_id }, data: { status: RoomStatus.DIRTY } })]
        : []),
    ]);
  },
};
