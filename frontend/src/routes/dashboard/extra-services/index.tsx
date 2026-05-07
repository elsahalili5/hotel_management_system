import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/Button'
import { DataTable } from '#/modules/admin/components/DataTable'
import { ConfirmModal } from '#/modules/admin/components/ConfirmModal'
import { ExtraServiceModal } from '#/modules/extra-services/extra-service/components/ExtraServiceModal'
import type { Column } from '#/modules/admin/components/DataTable'
import {
  useExtraServices,
  useCreateExtraService,
  useUpdateExtraService,
  useDeleteExtraService,
} from '#/modules/extra-services/extra-service/hooks/use-extra-services'
import { useServiceCategories } from '#/modules/extra-services/service-category/hooks/use-service-categories'
import type { ExtraServiceResponse, CreateExtraServiceInput } from '@mansio/shared'

export const Route = createFileRoute('/dashboard/extra-services/')({
  beforeLoad: ({ context }) => {
    requireRole(context.auth, {
      role: [ROLES.ADMIN, ROLES.MANAGER],
      redirectTo: '/dashboard',
    })
  },
  component: ExtraServicesPage,
})

function ExtraServicesPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<ExtraServiceResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ExtraServiceResponse | null>(null)

  const { data: services, isLoading, isError } = useExtraServices()
  const { data: categories = [] } = useServiceCategories()
  const createMutation = useCreateExtraService()
  const updateMutation = useUpdateExtraService()
  const deleteMutation = useDeleteExtraService()

  const columns: Column<ExtraServiceResponse>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (r) => <span className="text-sm font-medium text-mansio-ink">{r.name}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      render: (r) => <span className="text-sm text-mansio-mocha">{r.category.name}</span>,
    },
    {
      key: 'price',
      header: 'Price',
      render: (r) => <span className="text-sm text-mansio-mocha">€{Number(r.price).toFixed(2)}</span>,
    },
    {
      key: 'is_available_24h',
      header: 'Availability',
      render: (r) =>
        r.is_available_24h ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">24h</span>
        ) : (
          <span className="text-sm text-mansio-mocha">
            {r.available_from && r.available_until ? `${r.available_from} – ${r.available_until}` : '—'}
          </span>
        ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (r) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-mansio-ink/10 text-mansio-mocha'}`}>
          {r.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ]

  return (
    <>
      {showAdd && (
        <ExtraServiceModal
          title="Add Service"
          categories={categories}
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
        <ExtraServiceModal
          title="Edit Service"
          categories={categories}
          defaultValues={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={async (data: CreateExtraServiceInput) => {
            await updateMutation.mutateAsync({ id: editTarget.id, data })
            setEditTarget(null)
          }}
          isPending={updateMutation.isPending}
          isError={updateMutation.isError}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-mansio-mocha">
          {services ? `${services.length} services total` : ''}
        </p>
        <Button onClick={() => setShowAdd(true)} startIcon={<Plus size={13} />}>
          Add Service
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-center py-10 text-mansio-mocha">Loading...</p>
      )}
      {isError && (
        <p className="text-sm text-center py-10 text-red-500">Failed to load services.</p>
      )}
      {services && (
        <DataTable
          title="Extra Services"
          columns={columns}
          rows={services}
          getRowKey={(r) => String(r.id)}
          onEdit={(r) => setEditTarget(r)}
          onDelete={(r) => setDeleteTarget(r)}
        />
      )}
    </>
  )
}
