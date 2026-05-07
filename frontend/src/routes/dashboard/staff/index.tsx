import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { DataTable } from '#/modules/admin/components/DataTable'
import type { Column } from '#/modules/admin/components/DataTable'
import {
  useStaff,
  useUpdateStaff,
  useDeleteStaff,
} from '#/modules/staff/hooks/use-staff'
import { StaffModal } from '#/modules/staff/components/StaffModal'
import { ConfirmModal } from '#/modules/admin/components/ConfirmModal'
import type { StaffResponse, UpdateStaffInput } from '@mansio/shared'

export const Route = createFileRoute('/dashboard/staff/')({
  beforeLoad: ({ context }) => {
    requireRole(context.auth, {
      role: [ROLES.ADMIN, ROLES.MANAGER],
      redirectTo: '/dashboard',
    })
  },
  component: StaffPage,
})

const cell = (value: string | null | undefined) => (
  <span className="text-sm text-mansio-mocha">{value ?? '—'}</span>
)

function StaffPage() {
  const [editTarget, setEditTarget] = useState<StaffResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<StaffResponse | null>(null)
  const { data: staff, isLoading, isError } = useStaff()
  const updateMutation = useUpdateStaff()
  const deleteMutation = useDeleteStaff()

  const columns: Column<StaffResponse>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (r) => (
        <span className="text-sm font-medium text-mansio-ink">
          {r.user.first_name} {r.user.last_name}
        </span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (r) => cell(r.user.email),
    },
    {
      key: 'phone_number',
      header: 'Phone',
      render: (r) => cell(r.phone_number),
    },
    {
      key: 'shift',
      header: 'Shift',
      render: (r) => (
        <span className="text-sm text-mansio-mocha capitalize">
          {r.shift.toLowerCase()}
        </span>
      ),
    },
  ]

  return (
    <>
      {deleteTarget && (
        <ConfirmModal
          message={`Are you sure you want to delete staff ${deleteTarget.user.first_name} ${deleteTarget.user.last_name}?`}
          onConfirm={() => {
            deleteMutation.mutate(deleteTarget.user_id)
            setDeleteTarget(null)
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
      {editTarget && (
        <StaffModal
          title="Edit Staff"
          defaultValues={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={async (data: UpdateStaffInput) => {
            await updateMutation.mutateAsync({ id: editTarget.id, data })
            setEditTarget(null)
          }}
          isPending={updateMutation.isPending}
          isError={updateMutation.isError}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-mansio-mocha">
          {staff ? `${staff.length} staff total` : ''}
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-center py-10 text-mansio-mocha">
          Loading...
        </p>
      )}
      {isError && (
        <p className="text-sm text-center py-10 text-red-500">
          Failed to load staff.
        </p>
      )}
      {staff && (
        <DataTable
          title="All Staff"
          columns={columns}
          rows={staff}
          getRowKey={(r) => String(r.id)}
          onEdit={(r) => setEditTarget(r)}
          onDelete={(r) => setDeleteTarget(r)}
        />
      )}
    </>
  )
}
