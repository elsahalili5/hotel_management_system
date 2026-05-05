import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/Button'
import { DataTable } from '#/modules/admin/components/DataTable'
import { RoomModal } from '#/modules/rooms/room/components/RoomModal'
import type { Column } from '#/modules/admin/components/DataTable'
import {
  useRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
} from '#/modules/rooms/room/hooks/use-rooms'
import type { RoomResponse, UpdateRoomInput } from '@mansio/shared'

export const Route = createFileRoute('/dashboard/rooms/')({
  beforeLoad: ({ context }) => {
    requireRole(context.auth, {
      role: [ROLES.ADMIN, ROLES.MANAGER],
      redirectTo: '/dashboard',
    })
  },
  component: RoomsPage,
})

const cell = (value: string | number) => (
  <span className="text-sm text-mansio-mocha">{value}</span>
)

const statusColors: Record<string, string> = {
  AVAILABLE: 'text-green-600 bg-green-50',
  OCCUPIED: 'text-blue-600 bg-blue-50',
  DIRTY: 'text-orange-600 bg-orange-50',
  CLEANING: 'text-yellow-600 bg-yellow-50',
}

function RoomsPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<RoomResponse | null>(null)
  const { data: rooms, isLoading, isError } = useRooms()
  const createMutation = useCreateRoom()
  const updateMutation = useUpdateRoom()
  const deleteMutation = useDeleteRoom()

  const columns: Column<RoomResponse>[] = [
    {
      key: 'room_number',
      header: 'Room',
      render: (r) => (
        <span className="text-sm font-medium text-mansio-ink">
          #{r.room_number}
        </span>
      ),
    },
    { key: 'floor', header: 'Floor', render: (r) => cell(`Floor ${r.floor}`) },
    { key: 'type', header: 'Type', render: (r) => cell(r.room_type.name) },
    {
      key: 'price',
      header: 'Price',
      render: (r) => cell(`€${r.room_type.base_price}`),
    },
    {
      key: 'occupancy',
      header: 'Max',
      render: (r) => cell(`${r.room_type.max_occupancy}p`),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[r.status] ?? 'text-mansio-mocha bg-mansio-cream'}`}
        >
          {r.status}
        </span>
      ),
    },
  ]

  return (
    <>
      {showAdd && (
        <RoomModal
          title="Add Room"
          onClose={() => setShowAdd(false)}
          onSubmit={async (data) => {
            await createMutation.mutateAsync(data)
            setShowAdd(false)
          }}
          isPending={createMutation.isPending}
          isError={createMutation.isError}
        />
      )}
      {editTarget && (
        <RoomModal
          title="Edit Room"
          defaultValues={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={async (data) => {
            await updateMutation.mutateAsync({
              id: editTarget.id,
              data: data as UpdateRoomInput,
            })
            setEditTarget(null)
          }}
          isPending={updateMutation.isPending}
          isError={updateMutation.isError}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-mansio-mocha">
          {rooms ? `${rooms.length} rooms total` : ''}
        </p>
        <Button onClick={() => setShowAdd(true)} startIcon={<Plus size={13} />}>
          Add Room
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-center py-10 text-mansio-mocha">
          Loading...
        </p>
      )}
      {isError && (
        <p className="text-sm text-center py-10 text-red-500">
          Failed to load rooms.
        </p>
      )}
      {rooms && (
        <DataTable
          title="All Rooms"
          columns={columns}
          rows={rooms}
          getRowKey={(r) => String(r.id)}
          onEdit={(r) => setEditTarget(r)}
          onDelete={(r) => {
            if (confirm(`Delete room #${r.room_number}?`))
              deleteMutation.mutate(r.id)
          }}
        />
      )}
    </>
  )
}
