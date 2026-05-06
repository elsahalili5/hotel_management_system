import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { Plus, Clock, CheckCircle2, Circle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/Button'
import { DataTable } from '#/modules/admin/components/DataTable'
import { CleaningTaskModal } from '#/modules/cleaning-task/components/cleaningTaskModal'
import type { Column } from '#/modules/admin/components/DataTable'
import {
  useCleaningTasks,
  useCreateCleaningTask,
  useDeleteCleaningTask,
} from '#/modules/cleaning-task/hooks/use-cleaning-tasks'
import type { CleaningTaskResponse } from '@mansio/shared'
import { TaskStatus } from '@mansio/shared'

export const Route = createFileRoute('/dashboard/cleaning-tasks/')({
  beforeLoad: ({ context }) => {
    requireRole(context.auth, {
      role: [ROLES.ADMIN, ROLES.MANAGER],
      redirectTo: '/dashboard',
    })
  },
  component: CleaningTasksPage,
})

function StatusBadge({ status }: { status: TaskStatus }) {
  const styles = {
    [TaskStatus.PENDING]: { icon: Circle, color: 'text-amber-500', bg: 'bg-amber-50' },
    [TaskStatus.IN_PROGRESS]: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    [TaskStatus.COMPLETED]: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  }

  const { icon: Icon, color, bg } = styles[status]

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md w-fit ${bg} ${color}`}>
      <Icon size={13} />
      <span className="text-xs font-bold uppercase tracking-wider">{status}</span>
    </div>
  )
}

function CleaningTasksPage() {
  const [showAdd, setShowAdd] = useState(false)
  const { data: tasks, isLoading, isError } = useCleaningTasks()
  const createMutation = useCreateCleaningTask()
  const deleteMutation = useDeleteCleaningTask()

  const columns: Column<CleaningTaskResponse>[] = [
    {
      key: 'room',
      header: 'Room',
      render: (t) => (
        <span className="text-sm font-bold text-mansio-ink">
          Room {t.room.room_number}
        </span>
      ),
    },
    {
      key: 'staff',
      header: 'Assigned To',
      render: (t) => (
        <span className="text-sm text-mansio-mocha">
          {t.staff.user.first_name} {t.staff.user.last_name}
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
  ]

  return (
    <>
      {showAdd && (
        <CleaningTaskModal
          onClose={() => setShowAdd(false)}
          onSubmit={async (data) => {
            await createMutation.mutateAsync(data)
            setShowAdd(false)
          }}
          isPending={createMutation.isPending}
          isError={createMutation.isError}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-mansio-mocha">
          {tasks ? `${tasks.length} tasks total` : ''}
        </p>
        <Button onClick={() => setShowAdd(true)} startIcon={<Plus size={13} />}>
          Assign New Task
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-center py-10 text-mansio-mocha italic">
          Fetching cleaning schedule...
        </p>
      )}
      
      {isError && (
        <p className="text-sm text-center py-10 text-red-500 font-medium">
          Failed to load cleaning tasks.
        </p>
      )}

      {tasks && (
        <DataTable
          title="Daily Cleaning Tasks"
          columns={columns}
          rows={tasks}
          getRowKey={(t) => String(t.id)}
          onDelete={(t) => {
            if (confirm(`Cancel cleaning task for Room ${t.room.room_number}?`)) {
              deleteMutation.mutate(t.id)
            }
          }}
        />
      )}
    </>
  )
}