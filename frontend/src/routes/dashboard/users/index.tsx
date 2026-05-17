import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { requireRole } from '#/lib/route-guard'
import { useAuth } from '#/modules/auth/hooks/use-auth'
import { Button } from '#/components/Button'
import { DataTable } from '#/modules/admin/components/DataTable'
import type { Column } from '#/modules/admin/components/DataTable'
import { ROLES } from '@mansio/shared'
import {
  useCreateGuest,
  useCreateStaff,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from '#/modules/users/hooks/use-users'
import { UserModal } from '#/modules/users/components/UserModal'
import { ConfirmModal } from '#/components/ConfirmModal'
import type { UserEditPayload } from '#/modules/users/components/UserModal'
import type {
  CreateGuestInput,
  CreateStaffInput,
  UserResponse,
} from '@mansio/shared'

export const Route = createFileRoute('/dashboard/users/')({
  beforeLoad: ({ context }) => {
    requireRole(context.auth, {
      role: [ROLES.ADMIN, ROLES.MANAGER],
      redirectTo: '/dashboard',
    })
  },
  component: UsersPage,
})

const cell = (value: string | null | undefined) => (
  <span className="text-sm text-mansio-mocha">{value ?? '—'}</span>
)
// nese ska value me bo -

function UsersPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState<UserResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserResponse | null>(null)
  const { data: users, isLoading, isError } = useUsers()
  const { hasRole } = useAuth()
  const canCreate = hasRole([ROLES.ADMIN, ROLES.MANAGER])
  const canCreateGuest = hasRole(ROLES.ADMIN)
  const createGuestMutation = useCreateGuest()
  const createStaffMutation = useCreateStaff()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  const isCreating =
    createGuestMutation.isPending || createStaffMutation.isPending
  const isCreateError =
    createGuestMutation.isError || createStaffMutation.isError

  const columns: Column<UserResponse>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (r) => (
        <span className="text-sm font-medium text-mansio-ink">
          {r.first_name} {r.last_name}
        </span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (r) => cell(r.email),
    },
    {
      key: 'role',
      header: 'Role',
      render: (r) => {
        const role = r.user_roles[0]?.role?.name ?? '—'
        return (
          <span className="text-sm text-mansio-mocha capitalize">
            {role.toLowerCase()}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <span className="text-sm text-mansio-mocha capitalize">
          {r.status.toLowerCase()}
        </span>
      ),
    },
  ]

  async function handleEdit(data: UserEditPayload) {
    if (!editTarget) return
    await updateMutation.mutateAsync({ id: editTarget.id, data })
    setEditTarget(null)
  }

  return (
    <>
      {deleteTarget && (
        <ConfirmModal
          message={`Are you sure you want to delete user ${deleteTarget.first_name} ${deleteTarget.last_name}?`}
          onConfirm={() => {
            deleteMutation.mutate(deleteTarget.id)
            setDeleteTarget(null)
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
      {showAdd && (
        <UserModal
          mode="create"
          canCreateGuest={canCreateGuest}
          onClose={() => setShowAdd(false)}
          onCreate={async (data: CreateGuestInput | CreateStaffInput) => {
            if ('role' in data) {
              await createStaffMutation.mutateAsync(data)
            } else {
              await createGuestMutation.mutateAsync(data)
            }
            setShowAdd(false)
          }}
          isPending={isCreating}
          isError={isCreateError}
        />
      )}
      {editTarget && (
        <UserModal
          mode="edit"
          defaultValues={editTarget}
          onClose={() => setEditTarget(null)}
          onEdit={handleEdit}
          isPending={updateMutation.isPending}
          isError={updateMutation.isError}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-mansio-mocha">
          {users ? `${users.length} users total` : ''}
        </p>
        {canCreate && (
          <Button
            onClick={() => setShowAdd(true)}
            startIcon={<Plus size={13} />}
          >
            Add User
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
          Failed to load users.
        </p>
      )}
      {users && (
        <DataTable
          title="All Users"
          columns={columns}
          rows={users}
          getRowKey={(r) => String(r.id)}
          onEdit={(r) => setEditTarget(r)}
          onDelete={(r) => setDeleteTarget(r)}
        />
      )}
    </>
  )
}
