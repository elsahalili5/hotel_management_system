import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { Clock, CheckCircle2, Circle, PlayCircle } from 'lucide-react'
import { DataTable } from '#/modules/admin/components/DataTable'
import { Button } from '#/components/Button'
import type { Column } from '#/modules/admin/components/DataTable'
import {
  useMyCleaningTasks,
  useUpdateCleaningTaskStatus,
} from '#/modules/cleaning-task/hooks/use-cleaning-tasks'
import type { CleaningTaskResponse } from '@mansio/shared'
import { TaskStatus } from '@mansio/shared'

export const Route = createFileRoute('/dashboard/my-tasks/')({
  beforeLoad: ({ context }) => {
    requireRole(context.auth, {
      role: [ROLES.HOUSEKEEPING],
      redirectTo: '/dashboard',
    })
  },
  component: MyTasksPage,
})

const statusConfig: Record<TaskStatus, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  [TaskStatus.PENDING]: { icon: Circle, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Pending' },
  [TaskStatus.IN_PROGRESS]: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', label: 'In Progress' },
  [TaskStatus.COMPLETED]: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Completed' },
}



function StatusBadge({ status }: { status: TaskStatus }) {
  const { icon: Icon, color, bg, label } = statusConfig[status]
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md w-fit ${bg} ${color}`}>
      <Icon size={13} />
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
  )
}

function MyTasksPage() {
  const { data: tasks, isLoading, isError } = useMyCleaningTasks()
  const updateStatus = useUpdateCleaningTaskStatus()

  const columns: Column<CleaningTaskResponse>[] = [
    {
      key: 'room',
      header: 'Room',
      render: (t) => (
        <span className="text-sm font-medium text-mansio-ink">
          Room {t.room.room_number} — Floor {t.room.floor}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (t) => (
        <span className="text-sm text-mansio-mocha">
          {t.due_date ? new Date(t.due_date).toLocaleString() : 'No deadline'}
        </span>
      ),
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (t) => (
        <span className="text-sm text-mansio-mocha italic">
          {t.notes ?? '—'}
        </span>
      ),
    },
    {
      key: 'action',
      header: '',
      render: (t) => {
        if (t.status === TaskStatus.COMPLETED) return null
        const next = t.status === TaskStatus.PENDING ? TaskStatus.IN_PROGRESS : TaskStatus.COMPLETED
        const label = next === TaskStatus.IN_PROGRESS ? 'In Progress' : 'Completed'
        return (
          <Button
            variant="ghost"
            onClick={() => updateStatus.mutate({ id: t.id, data: { status: next } })}
            disabled={updateStatus.isPending}
            startIcon={<PlayCircle size={13} />}
          >
            Mark {label}
          </Button>
        )
      },
    },
  ]

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-mansio-mocha">
          {tasks ? `${tasks.length} tasks assigned to you` : ''}
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-center py-10 text-mansio-mocha">Loading...</p>
      )}
      {isError && (
        <p className="text-sm text-center py-10 text-red-500">Failed to load tasks.</p>
      )}
      {tasks && (
        <DataTable
          title="My Cleaning Tasks"
          columns={columns}
          rows={tasks}
          getRowKey={(t) => String(t.id)}
        />
      )}
    </>
  )
}