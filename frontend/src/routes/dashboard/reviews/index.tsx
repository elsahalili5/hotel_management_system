import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { useAuth } from '#/modules/auth/hooks/use-auth'
import { DataTable } from '#/modules/admin/components/DataTable'
import type { Column } from '#/modules/admin/components/DataTable'
import { useReviews, useApproveReview, useDeleteReview } from '#/modules/review/hooks/use-reviews'
import type { ReviewResponse } from '@mansio/shared'
import { ConfirmModal } from '#/components/ConfirmModal'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard/reviews/')({
  beforeLoad: ({ context }) => {
    requireRole(context.auth, {
      role: [ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST],
      redirectTo: '/dashboard',
    })
  },
  component: ReviewsPage,
})

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-mansio-gold text-sm tracking-tight">
      {'★'.repeat(rating)}
      <span className="text-mansio-gold/30">{'★'.repeat(5 - rating)}</span>
    </span>
  )
}

function ReviewsPage() {
  const { hasRole } = useAuth()
  const canModify = hasRole([ROLES.ADMIN, ROLES.MANAGER])
  const [deleteTarget, setDeleteTarget] = useState<ReviewResponse | null>(null)
  const { data: reviews, isLoading, isError } = useReviews()
  const approveMutation = useApproveReview()
  const deleteMutation = useDeleteReview()

  const cell = (value: string | null | undefined) => (
    <span className="text-sm text-mansio-mocha">{value ?? '—'}</span>
  )

  const columns: Column<ReviewResponse>[] = [
    {
      key: 'guest',
      header: 'Guest',
      render: (r) => (
        <span className="text-sm font-medium text-mansio-ink">
          {r.guest.user.first_name} {r.guest.user.last_name}
        </span>
      ),
    },
    {
      key: 'room',
      header: 'Room',
      render: (r) => cell(r.reservation.room.room_number),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (r) => <StarRating rating={r.rating} />,
    },
    {
      key: 'title',
      header: 'Title',
      render: (r) => cell(r.title),
    },
    {
      key: 'comment',
      header: 'Comment',
      render: (r) => (
        <span className="text-sm text-mansio-mocha max-w-xs truncate block">
          {r.comment ?? '—'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (r) => cell(new Date(r.created_at).toLocaleDateString()),
    },
    {
      key: 'is_approved',
      header: 'Status',
      render: (r) =>
        canModify ? (
          <button
            onClick={() =>
              approveMutation.mutate({ id: r.id, is_approved: !r.is_approved })
            }
            className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
              r.is_approved
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            {r.is_approved ? 'Approved' : 'Pending'}
          </button>
        ) : (
          <span
            className={`text-xs px-2 py-1 rounded font-medium ${
              r.is_approved
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {r.is_approved ? 'Approved' : 'Pending'}
          </span>
        ),
    },
  ]

  return (
    <>
      {deleteTarget && (
        <ConfirmModal
          message={`Delete review by ${deleteTarget.guest.user.first_name} ${deleteTarget.guest.user.last_name}?`}
          onConfirm={() => {
            deleteMutation.mutate(deleteTarget.id)
            setDeleteTarget(null)
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-mansio-mocha">
          {reviews ? `${reviews.length} reviews total` : ''}
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-center py-10 text-mansio-mocha">Loading...</p>
      )}
      {isError && (
        <p className="text-sm text-center py-10 text-red-500">
          Failed to load reviews.
        </p>
      )}
      {reviews && (
        <DataTable
          title="All Reviews"
          columns={columns}
          rows={reviews}
          getRowKey={(r) => String(r.id)}
          onDelete={canModify ? (r) => setDeleteTarget(r) : undefined}
        />
      )}
    </>
  )
}
