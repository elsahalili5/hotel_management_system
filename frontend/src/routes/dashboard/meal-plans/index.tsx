import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/Button'
import { DataTable } from '#/modules/admin/components/DataTable'
import { ConfirmModal } from '#/components/ConfirmModal'
import { MealPlanModal } from '#/modules/meal-plan/components/MealPlanModal'
import type { Column } from '#/modules/admin/components/DataTable'
import {
  useMealPlans,
  useCreateMealPlan,
  useUpdateMealPlan,
  useDeleteMealPlan,
} from '#/modules/meal-plan/hooks/use-meal-plans'
import type { MealPlanResponse, CreateMealPlanInput } from '@mansio/shared'

export const Route = createFileRoute('/dashboard/meal-plans/')({
  beforeLoad: ({ context }) => {
    requireRole(context.auth, {
      role: [ROLES.ADMIN, ROLES.MANAGER],
      redirectTo: '/dashboard',
    })
  },
  component: MealPlansPage,
})

function MealPlansPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<MealPlanResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MealPlanResponse | null>(null)

  const { data: mealPlans, isLoading, isError } = useMealPlans()
  const createMutation = useCreateMealPlan()
  const updateMutation = useUpdateMealPlan()
  const deleteMutation = useDeleteMealPlan()

  const columns: Column<MealPlanResponse>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (r) => <span className="text-sm font-medium text-mansio-ink">{r.name}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      render: (r) => (
        <span className="text-sm text-mansio-mocha">{r.description ?? '—'}</span>
      ),
    },
    {
      key: 'price_per_night',
      header: 'Price / Night',
      render: (r) => (
        <span className="text-sm text-mansio-mocha">€{Number(r.price_per_night).toFixed(2)}</span>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (r) => (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-mansio-ink/10 text-mansio-mocha'}`}
        >
          {r.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ]

  return (
    <>
      {showAdd && (
        <MealPlanModal
          title="Add Meal Plan"
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
        <MealPlanModal
          title="Edit Meal Plan"
          defaultValues={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={async (data: CreateMealPlanInput) => {
            await updateMutation.mutateAsync({ id: editTarget.id, data })
            setEditTarget(null)
          }}
          isPending={updateMutation.isPending}
          isError={updateMutation.isError}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-mansio-mocha">
          {mealPlans ? `${mealPlans.length} meal plans total` : ''}
        </p>
        <Button onClick={() => setShowAdd(true)} startIcon={<Plus size={13} />}>
          Add Meal Plan
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-center py-10 text-mansio-mocha">Loading...</p>
      )}
      {isError && (
        <p className="text-sm text-center py-10 text-red-500">Failed to load meal plans.</p>
      )}
      {mealPlans && (
        <DataTable
          title="Meal Plans"
          columns={columns}
          rows={mealPlans}
          getRowKey={(r) => String(r.id)}
          onEdit={(r) => setEditTarget(r)}
          onDelete={(r) => setDeleteTarget(r)}
        />
      )}
    </>
  )
}
