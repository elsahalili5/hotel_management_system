import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/Button'
import { DataTable } from '#/modules/admin/components/DataTable'
import { ConfirmModal } from '#/components/ConfirmModal'
import { ServiceCategoryModal } from '#/modules/extra-services/service-category/components/ServiceCategoryModal'
import type { Column } from '#/modules/admin/components/DataTable'
import {
  useServiceCategories,
  useCreateServiceCategory,
  useUpdateServiceCategory,
  useDeleteServiceCategory,
} from '#/modules/extra-services/service-category/hooks/use-service-categories'
import type { ServiceCategoryResponse, CreateServiceCategoryInput } from '@mansio/shared'

export const Route = createFileRoute('/dashboard/service-categories/')({
  beforeLoad: ({ context }) => {
    requireRole(context.auth, {
      role: [ROLES.ADMIN, ROLES.MANAGER],
      redirectTo: '/dashboard',
    })
  },
  component: ServiceCategoriesPage,
})

function ServiceCategoriesPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<ServiceCategoryResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ServiceCategoryResponse | null>(null)

  const { data: categories, isLoading, isError } = useServiceCategories()
  const createMutation = useCreateServiceCategory()
  const updateMutation = useUpdateServiceCategory()
  const deleteMutation = useDeleteServiceCategory()

  const columns: Column<ServiceCategoryResponse>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (r) => <span className="text-sm font-medium text-mansio-ink">{r.name}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      render: (r) => <span className="text-sm text-mansio-mocha">{r.description ?? '—'}</span>,
    },
    {
      key: 'sort_order',
      header: 'Order',
      render: (r) => <span className="text-sm text-mansio-mocha">{r.sort_order}</span>,
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
    {
      key: '_count',
      header: 'Services',
      render: (r) => <span className="text-sm text-mansio-mocha">{r._count.services}</span>,
    },
  ]

  return (
    <>
      {showAdd && (
        <ServiceCategoryModal
          title="Add Category"
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
        <ServiceCategoryModal
          title="Edit Category"
          defaultValues={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={async (data: CreateServiceCategoryInput) => {
            await updateMutation.mutateAsync({ id: editTarget.id, data })
            setEditTarget(null)
          }}
          isPending={updateMutation.isPending}
          isError={updateMutation.isError}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-mansio-mocha">
          {categories ? `${categories.length} categories total` : ''}
        </p>
        <Button onClick={() => setShowAdd(true)} startIcon={<Plus size={13} />}>
          Add Category
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-center py-10 text-mansio-mocha">Loading...</p>
      )}
      {isError && (
        <p className="text-sm text-center py-10 text-red-500">Failed to load categories.</p>
      )}
      {categories && (
        <DataTable
          title="Service Categories"
          columns={columns}
          rows={categories}
          getRowKey={(r) => String(r.id)}
          onEdit={(r) => setEditTarget(r)}
          onDelete={(r) => setDeleteTarget(r)}
        />
      )}
    </>
  )
}