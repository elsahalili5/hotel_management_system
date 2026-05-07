import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { Plus, Clock, CheckCircle2, Circle, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/Button'
import { DataTable } from '#/modules/admin/components/DataTable'
import { DashboardCard } from '#/modules/admin/components/DashboardCard'
import { CleaningTaskModal } from '#/modules/cleaning-task/components/cleaningTaskModal'
import { ConfirmModal } from '#/modules/admin/components/ConfirmModal'
import type { Column } from '#/modules/admin/components/DataTable'
import {
  useCleaningTasks,
  useCreateCleaningTask,
  useDeleteCleaningTask,
} from '#/modules/cleaning-task/hooks/use-cleaning-tasks'
import { useRoomStats } from '#/modules/rooms/room/hooks/use-rooms'
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
  const [deleteTarget, setDeleteTarget] = useState<CleaningTaskResponse | null>(null)
  const { data: tasks, isLoading, isError } = useCleaningTasks()
  const { data: stats } = useRoomStats()
  const dirtyCount = stats?.DIRTY ?? 0
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
      {deleteTarget && (
        <ConfirmModal
          message={`Cancel cleaning task for Room ${deleteTarget.room.room_number}?`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteMutation.mutate(deleteTarget.id)
            setDeleteTarget(null)
          }}
        />
      )}

      {dirtyCount > 0 && (
        <DashboardCard className="flex items-center gap-3 px-5 py-4 mb-6">
          <AlertTriangle size={16} className="text-orange-500 shrink-0" />
          <p className="text-sm text-mansio-mocha">
            <span className="font-semibold text-mansio-ink">{dirtyCount}</span> {dirtyCount === 1 ? 'room needs' : 'rooms need'} cleaning — assign a task.
          </p>
        </DashboardCard>
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
          onDelete={(t) => setDeleteTarget(t)}
        />
      )}
    </>
  )
}