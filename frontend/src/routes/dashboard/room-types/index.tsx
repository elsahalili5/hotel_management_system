import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/Button'
import { useAuth } from '#/modules/auth/hooks/use-auth'
import { DataTable } from '#/modules/admin/components/DataTable'
import { RoomTypeModal } from '#/modules/rooms/room-type/components/RoomTypeModal'
import { ConfirmModal } from '#/modules/admin/components/ConfirmModal'
import type { Column } from '#/modules/admin/components/DataTable'
import {
  useRoomTypes,
  useCreateRoomType,
  useUpdateRoomType,
  useDeleteRoomType,
  roomTypeKeys,
} from '#/modules/rooms/room-type/hooks/use-room-types'
import type { RoomTypeResponse } from '@mansio/shared'

export const Route = createFileRoute('/dashboard/room-types/')({
  beforeLoad: ({ context }) => {
    requireRole(context.auth, {
      role: [ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST],
      redirectTo: '/dashboard',
    })
  },
  component: RoomTypesPage,
})

const cell = (value: string | number) => (
  <span className="text-sm text-mansio-mocha">{value}</span>
)

function RoomTypesPage() {
  const { hasRole } = useAuth()
  const canManage = hasRole([ROLES.ADMIN, ROLES.MANAGER])
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<RoomTypeResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<RoomTypeResponse | null>(
    null,
  )
  const { data: roomTypes, isLoading, isError } = useRoomTypes()
  const createMutation = useCreateRoomType()
  const updateMutation = useUpdateRoomType()
  const deleteMutation = useDeleteRoomType()

  const columns: Column<RoomTypeResponse>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (r) => (
        <span className="text-sm font-medium text-mansio-ink">{r.name}</span>
      ),
    },
    {
      key: 'price',
      header: 'Base Price',
      render: (r) => cell(`€${r.base_price}`),
    },
    {
      key: 'occupancy',
      header: 'Max Occupancy',
      render: (r) => cell(`${r.max_occupancy} guests`),
    },
    {
      key: 'size',
      header: 'Size',
      render: (r) => cell(r.size_m2 ? `${r.size_m2} m²` : '—'),
    },
    { key: 'rooms', header: 'Rooms', render: (r) => cell(r._count.rooms) },
    {
      key: 'amenities',
      header: 'Amenities',
      render: (r) => cell(r.amenities.length),
    },
  ]

  return (
    <>
      {showAdd && (
        <RoomTypeModal
          title="Add Room Type"
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
        <RoomTypeModal
          title="Edit Room Type"
          defaultValues={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={async (data) => {
            await updateMutation.mutateAsync({ id: editTarget.id, data })
            setEditTarget(null)
          }}
          isPending={updateMutation.isPending}
          isError={updateMutation.isError}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-mansio-mocha">
          {roomTypes ? `${roomTypes.length} room types total` : ''}
        </p>
        {canManage && (
          <Button
            onClick={() => setShowAdd(true)}
            startIcon={<Plus size={13} />}
          >
            Add Room Type
          </Button>
        )}
      </div>

      {isLoading && (
        <p className="text-sm text-center py-10 text-mansio-mocha">
          Loading...
        </p>
      )}
      {isError && (
        <p className="text-sm text-center py-10 text-red-500">
          Failed to load room types.
        </p>
      )}
      {roomTypes && (
        <DataTable
          title="All Room Types"
          columns={columns}
          rows={roomTypes}
          getRowKey={(r) => String(r.id)}
          onEdit={canManage ? (r) => setEditTarget(r) : undefined}
          onDelete={canManage ? (r) => setDeleteTarget(r) : undefined}
        />
      )}
    </>
  )
}
