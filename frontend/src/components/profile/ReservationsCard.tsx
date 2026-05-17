import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { BedDouble, CalendarDays, LogOut } from 'lucide-react'
import { useMyReservations } from '#/modules/reservation/hooks/use-reservations'
import { GuestReservationModal } from '#/modules/reservation/components/GuestReservationModal'
import { ReviewModal } from '#/modules/review/components/ReviewModal'
import type { ReservationResponse } from '@mansio/shared'

const fmt = (d: string | Date) => new Date(d).toLocaleDateString('en-GB')

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-blue-50 text-blue-600',
  CHECKED_IN: 'bg-green-50 text-green-600',
  CHECKED_OUT: 'bg-mansio-gold/10 text-mansio-taupe',
  CANCELLED: 'bg-red-50 text-red-500',
  NO_SHOW: 'bg-amber-50 text-amber-600',
}

function ReservationItem({
  r,
  onClick,
}: {
  r: ReservationResponse
  onClick: () => void
}) {
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewed, setReviewed] = useState(false)
  const total = r.invoice?.items.reduce((s, i) => s + Number(i.total), 0) ?? 0

  return (
    <>
      <div
        onClick={onClick}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b border-mansio-gold/10 last:border-0 cursor-pointer hover:bg-mansio-gold/5 transition-colors rounded px-2 -mx-2"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-mansio-gold/10 flex items-center justify-center flex-shrink-0">
            <BedDouble size={16} className="text-mansio-gold" />
          </div>
          <div>
            <p className="text-sm font-medium text-mansio-espresso">
              Room #{r.room.room_number} — {r.room.room_type.name}
            </p>
            {r.meal_plan && (
              <p className="text-xs text-mansio-taupe mt-0.5">
                {r.meal_plan.name}
              </p>
            )}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-mansio-taupe">
              <span className="flex items-center gap-1">
                <CalendarDays size={11} />
                {fmt(r.check_in_date)}
              </span>
              <span className="flex items-center gap-1">
                <LogOut size={11} />
                {fmt(r.check_out_date)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:flex-col sm:items-end">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[r.status] ?? 'bg-mansio-gold/10 text-mansio-taupe'}`}
          >
            {r.status.replace('_', ' ')}
          </span>
          {total > 0 && (
            <p className="text-sm font-medium text-mansio-espresso">
              €{total.toFixed(2)}
            </p>
          )}
          {r.status === 'CHECKED_OUT' && !reviewed && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setReviewOpen(true)
              }}
              className="text-xs tracking-widest uppercase px-3 py-1.5 bg-mansio-gold text-mansio-espresso font-medium hover:opacity-80 transition-opacity"
            >
              Leave a Review
            </button>
          )}
          {reviewed && (
            <span className="text-xs text-mansio-taupe">✓ Reviewed</span>
          )}
        </div>
      </div>

      {reviewOpen && (
        <ReviewModal
          reservationId={r.id}
          roomNumber={r.room.room_number}
          onClose={() => setReviewOpen(false)}
          onSuccess={() => setReviewed(true)}
        />
      )}
    </>
  )
}

export function ReservationsCard() {
  const { data: reservations, isLoading } = useMyReservations()
  const [selected, setSelected] = useState<ReservationResponse | null>(null)

  return (
    <div className="bg-mansio-ivory p-8">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase mb-1 text-mansio-gold">
          History
        </p>
        <h2 className="font-serif text-2xl text-mansio-espresso">
          My Reservations
        </h2>
      </div>

      {isLoading && (
        <p className="text-sm text-mansio-taupe py-8 text-center">Loading...</p>
      )}

      {!isLoading && reservations && reservations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-mansio-gold/10 flex items-center justify-center mb-6">
            <BedDouble size={22} className="text-mansio-gold" />
          </div>
          <h3 className="font-serif text-xl text-mansio-espresso mb-2">
            No Reservations Yet
          </h3>
          <p className="text-sm font-light text-mansio-taupe max-w-xs leading-relaxed mb-8">
            You haven't made any reservations at Mansio. Start planning your
            perfect stay.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link to="/bookings" className="no-underline">
              <button className="inline-flex items-center gap-2 px-6 py-3 text-xs font-medium tracking-widest uppercase bg-mansio-gold text-mansio-espresso transition-opacity duration-200 hover:opacity-80">
                New booking
              </button>
            </Link>
            <Link to="/rooms" className="no-underline">
              <button className="inline-flex items-center gap-2 px-6 py-3 text-xs font-medium tracking-widest uppercase bg-mansio-espresso text-mansio-cream transition-opacity duration-200 hover:opacity-80">
                Explore rooms
              </button>
            </Link>
          </div>
        </div>
      )}

      {!isLoading && reservations && reservations.length > 0 && (
        <div>
          {reservations.map((r) => (
            <ReservationItem key={r.id} r={r} onClick={() => setSelected(r)} />
          ))}
        </div>
      )}

      {selected && (
        <GuestReservationModal
          reservation={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
