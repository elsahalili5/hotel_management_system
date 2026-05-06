import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { DataTable } from '#/modules/admin/components/DataTable'
import type { Column } from '#/modules/admin/components/DataTable'
import { useGuests, useUpdateGuest, useDeleteGuest } from '#/modules/guest/hooks/use-guests'
import { GuestModal } from '#/modules/guest/components/GuestModal'
import type { GuestResponse, UpdateGuestInput } from '@mansio/shared'

export const Route = createFileRoute('/dashboard/guests/')({
  beforeLoad: ({ context }) => {
    requireRole(context.auth, {
      role: [ROLES.ADMIN, ROLES.MANAGER,],
      redirectTo: '/dashboard',
    })
  },
  component: GuestsPage,
})

const cell = (value: string | null | undefined) => (
  <span className="text-sm text-mansio-mocha">{value ?? '—'}</span>
)

function GuestsPage() {
  const [editTarget, setEditTarget] = useState<GuestResponse | null>(null)
  const { data: guests, isLoading, isError } = useGuests()
  const updateMutation = useUpdateGuest()
  const deleteMutation = useDeleteGuest()

  const columns: Column<GuestResponse>[] = [
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
      key: 'city',
      header: 'City',
      render: (r) => cell(r.city),
    },
    {
      key: 'country',
      header: 'Country',
      render: (r) => cell(r.country),
    },
    {
      key: 'address',
      header: 'Address',
      render: (r) => cell(r.address),
    },
    {
      key: 'passport_number',
      header: 'Passport',
      render: (r) => cell(r.passport_number),
    },
    {
      key: 'date_of_birth',
      header: 'Date of Birth',
      render: (r) =>
        r.date_of_birth
          ? cell(new Date(r.date_of_birth).toLocaleDateString())
          : cell(null),
    },
  ]

  return (
    <>
      {editTarget && (
        <GuestModal
          title="Edit Guest"
          defaultValues={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={async (data: UpdateGuestInput) => {
            await updateMutation.mutateAsync({ id: editTarget.id, data })
            setEditTarget(null)
          }}
          isPending={updateMutation.isPending}
          isError={updateMutation.isError}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-mansio-mocha">
          {guests ? `${guests.length} guests total` : ''}
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-center py-10 text-mansio-mocha">Loading...</p>
      )}
      {isError && (
        <p className="text-sm text-center py-10 text-red-500">
          Failed to load guests.
        </p>
      )}
      {guests && (
        <DataTable
          title="All Guests"
          columns={columns}
          rows={guests}
          getRowKey={(r) => String(r.id)}
          onEdit={(r) => setEditTarget(r)}
          onDelete={(r) => {
            if (confirm(`Delete guest ${r.user.first_name} ${r.user.last_name}?`)) {
              deleteMutation.mutate(r.user_id)
            }
          }}
        />
      )}
    </>
  )
}
