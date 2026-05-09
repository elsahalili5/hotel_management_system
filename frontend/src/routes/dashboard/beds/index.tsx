import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/Button'
import { DataTable } from '#/modules/admin/components/DataTable'
import { BedModal } from '#/modules/rooms/bed/components/BedModal'
import { ConfirmModal } from '#/components/ConfirmModal'
import type { Column } from '#/modules/admin/components/DataTable'
import {
  useBeds,
  useCreateBed,
  useUpdateBed,
  useDeleteBed,
} from '#/modules/rooms/bed/hooks/use-beds'
import type { BedResponse, CreateBedInput } from '@mansio/shared'

export const Route = createFileRoute('/dashboard/beds/')({
  beforeLoad: ({ context }) => {
    requireRole(context.auth, {
      role: [ROLES.ADMIN, ROLES.MANAGER],
      redirectTo: '/dashboard',
    })
  },
  component: BedsPage,
})

const cell = (value: string | number) => (
  <span className="text-sm text-mansio-mocha">{value}</span>
)

function BedsPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<BedResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BedResponse | null>(null)
  const { data: beds, isLoading, isError } = useBeds()
  const createMutation = useCreateBed()
  const updateMutation = useUpdateBed()
  const deleteMutation = useDeleteBed()

  const columns: Column<BedResponse>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (r) => (
        <span className="text-sm font-medium text-mansio-ink">{r.name}</span>
      ),
    },
    {
      key: 'capacity',
      header: 'Capacity',
      render: (r) => cell(`${r.capacity} person${r.capacity > 1 ? 's' : ''}`),
    },
  ]

  return (
    <>
      {showAdd && (
        <BedModal
          title="Add Bed"
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
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteMutation.mutate(deleteTarget.id)
            setDeleteTarget(null)
          }}
        />
      )}
      {editTarget && (
        <BedModal
          title="Edit Bed"
          defaultValues={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={async (data: CreateBedInput) => {
            await updateMutation.mutateAsync({ id: editTarget.id, data })
            setEditTarget(null)
          }}
          isPending={updateMutation.isPending}
          isError={updateMutation.isError}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-mansio-mocha">
          {beds ? `${beds.length} bed types total` : ''}
        </p>
        <Button onClick={() => setShowAdd(true)} startIcon={<Plus size={13} />}>
          Add Bed
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-center py-10 text-mansio-mocha">
          Loading...
        </p>
      )}
      {isError && (
        <p className="text-sm text-center py-10 text-red-500">
          Failed to load beds.
        </p>
      )}
      {beds && (
        <DataTable
          title="All Bed Types"
          columns={columns}
          rows={beds}
          getRowKey={(r) => String(r.id)}
          onEdit={(r) => setEditTarget(r)}
          onDelete={(r) => setDeleteTarget(r)}
        />
      )}
    </>
  )
}
