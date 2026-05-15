import { X } from 'lucide-react'
import { Button } from '#/components/Button'
import type { ReservationResponse } from '@mansio/shared'

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  CHECKED_IN: 'bg-green-100 text-green-700',
  CHECKED_OUT: 'bg-mansio-ink/10 text-mansio-mocha',
  CANCELLED: 'bg-red-100 text-red-500',
  NO_SHOW: 'bg-amber-100 text-amber-700',
}

const fmt = (d: string | Date) => new Date(d).toLocaleDateString('en-GB')

const nights = (checkIn: string | Date, checkOut: string | Date) =>
  Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24),
  )

interface Props {
  reservation: ReservationResponse
  onClose: () => void
}

export function GuestReservationModal({ reservation, onClose }: Props) {
  const total =
    reservation.invoice?.items.reduce((s, i) => s + Number(i.total), 0) ?? 0
  const paid =
    reservation.invoice?.payments
      .filter((p) => p.status === 'COMPLETED')
      .reduce((s, p) => s + Number(p.amount), 0) ?? 0
  const remaining = Math.max(0, Math.round((total - paid) * 100) / 100)
  const stayNights = nights(
    reservation.check_in_date,
    reservation.check_out_date,
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-mansio-ink/10">
          <p className="font-serif text-base text-mansio-ink">
            Reservation #{reservation.id}
          </p>
          <button
            onClick={onClose}
            className="p-1 text-mansio-mocha hover:opacity-70 transition-opacity cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 text-sm text-mansio-mocha">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[reservation.status] ?? 'bg-mansio-ink/10 text-mansio-mocha'}`}
          >
            {reservation.status.replace('_', ' ')}
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs tracking-widest uppercase text-mansio-gold mb-1">
                Room
              </p>
              <p className="font-medium text-mansio-ink">
                #{reservation.room.room_number}
              </p>
              <p>{reservation.room.room_type.name}</p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-mansio-gold mb-1">
                Stay
              </p>
              <p className="font-medium text-mansio-ink">
                {stayNights} night{stayNights !== 1 ? 's' : ''}
              </p>
              <p>
                {fmt(reservation.check_in_date)} →{' '}
                {fmt(reservation.check_out_date)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs tracking-widest uppercase text-mansio-gold mb-1">
                Guests
              </p>
              <p>
                {reservation.adults} adults
                {reservation.children > 0
                  ? `, ${reservation.children} children`
                  : ''}
              </p>
            </div>
            {reservation.meal_plan && (
              <div>
                <p className="text-xs tracking-widest uppercase text-mansio-gold mb-1">
                  Meal Plan
                </p>
                <p>{reservation.meal_plan.name}</p>
              </div>
            )}
          </div>

          {reservation.invoice && (
            <div>
              <p className="text-xs tracking-widest uppercase text-mansio-gold mb-2">
                Invoice
              </p>
              <div className="border border-mansio-ink/10 divide-y divide-mansio-ink/10">
                {reservation.invoice.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between px-3 py-2 text-xs"
                  >
                    <span>{item.description}</span>
                    <span className="font-medium text-mansio-ink">
                      €{Number(item.total).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between px-3 py-2 font-medium text-mansio-ink">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between px-3 py-2 text-xs text-mansio-mocha">
                  <span>Paid</span>
                  <span>€{paid.toFixed(2)}</span>
                </div>
                {remaining > 0 && (
                  <div className="flex justify-between px-3 py-2 text-xs font-medium text-amber-700">
                    <span>Remaining at check-out</span>
                    <span>€{remaining.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-mansio-ink/10">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
