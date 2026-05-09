import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/Button'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DataTable } from '#/modules/admin/components/DataTable'
import { AmenityModal } from '#/modules/rooms/amenity/components/AmenityModal'
import { ConfirmModal } from '#/components/ConfirmModal'
import type { Column } from '#/modules/admin/components/DataTable'
import {
  useAmenities,
  useCreateAmenity,
  useUpdateAmenity,
  useDeleteAmenity,
} from '#/modules/rooms/amenity/hooks/use-amenities'
import type { AmenityResponse, CreateAmenityInput } from '@mansio/shared'

export const Route = createFileRoute('/dashboard/amenities/')({
  beforeLoad: ({ context }) => {
    requireRole(context.auth, {
      role: [ROLES.ADMIN, ROLES.MANAGER],
      redirectTo: '/dashboard',
    })
  },
  component: AmenitiesPage,
})

function AmenityIcon({ name }: { name: string | null }) {
  if (!name) return <span className="text-mansio-mocha">—</span>
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name]
  if (!Icon)
    return <span className="text-xs font-mono text-mansio-mocha">{name}</span>
  return <Icon size={16} className="text-mansio-mocha" />
}

function AmenitiesPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<AmenityResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AmenityResponse | null>(null)
  const { data: amenities, isLoading, isError } = useAmenities()
  const createMutation = useCreateAmenity()
  const updateMutation = useUpdateAmenity()
  const deleteMutation = useDeleteAmenity()

  const columns: Column<AmenityResponse>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (r) => (
        <span className="text-sm font-medium text-mansio-ink">{r.name}</span>
      ),
    },
    {
      key: 'icon',
      header: 'Icon',
      render: (r) => <AmenityIcon name={r.icon} />,
    },
  ]

  return (
    <>
      {showAdd && (
        <AmenityModal
          title="Add Amenity"
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
        <AmenityModal
          title="Edit Amenity"
          defaultValues={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={async (data: CreateAmenityInput) => {
            await updateMutation.mutateAsync({ id: editTarget.id, data })
            setEditTarget(null)
          }}
          isPending={updateMutation.isPending}
          isError={updateMutation.isError}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-mansio-mocha">
          {amenities ? `${amenities.length} amenities total` : ''}
        </p>
        <Button onClick={() => setShowAdd(true)} startIcon={<Plus size={13} />}>
          Add Amenity
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-center py-10 text-mansio-mocha">
          Loading...
        </p>
      )}
      {isError && (
        <p className="text-sm text-center py-10 text-red-500">
          Failed to load amenities.
        </p>
      )}
      {amenities && (
        <DataTable
          title="All Amenities"
          columns={columns}
          rows={amenities}
          getRowKey={(r) => String(r.id)}
          onEdit={(r) => setEditTarget(r)}
          onDelete={(r) => setDeleteTarget(r)}
        />
      )}
    </>
  )
}
