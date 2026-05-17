import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '#/components/Button'
import { Select } from '#/components/Select'
import {
  useCheckin,
  useCheckout,
  useNoShow,
} from '#/modules/reservation/hooks/use-reservations'
import type { ReservationResponse } from '@mansio/shared'

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  CHECKED_IN: 'bg-green-100 text-green-700',
  CHECKED_OUT: 'bg-mansio-ink/10 text-mansio-mocha',
  CANCELLED: 'bg-red-100 text-red-500',
  NO_SHOW: 'bg-amber-100 text-amber-700',
}

const fmt = (d: string | Date) => new Date(d).toLocaleDateString('en-GB')
const fmtTime = (d: string | Date | null | undefined) =>
  d ? new Date(d).toLocaleString('en-GB') : '—'

interface Props {
  reservation: ReservationResponse
  onClose: () => void
}

export function ReservationModal({ reservation, onClose }: Props) {
  const checkin = useCheckin()
  const checkout = useCheckout()
  const noShow = useNoShow()
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD'>('CASH')
  // veq ato qe jane confirm munden mu ba checkin ose no show, dhe veq ato qe jane checkin munden mu ba checkout
  const canCheckin = reservation.status === 'CONFIRMED'
  const canNoShow = reservation.status === 'CONFIRMED'
  const canCheckout = reservation.status === 'CHECKED_IN'

  const total =
    reservation.invoice?.items.reduce((s, i) => s + Number(i.total), 0) ?? 0
  const paid =
    reservation.invoice?.payments
      .filter((p) => p.status === 'COMPLETED')
      .reduce((s, p) => s + Number(p.amount), 0) ?? 0
  const remaining = Math.max(0, Math.round((total - paid) * 100) / 100)

  const isPending = checkin.isPending || checkout.isPending || noShow.isPending
  const error = checkin.error || checkout.error || noShow.error

  const handleCheckin = async () => {
    await checkin.mutateAsync(reservation.id)
    onClose()
  }

  const handleNoShow = async () => {
    await noShow.mutateAsync(reservation.id)
    onClose()
  }

  const handleCheckout = async () => {
    await checkout.mutateAsync({
      id: reservation.id,
      payment_method: paymentMethod,
    })
    onClose()
  }

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
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[reservation.status] ?? 'bg-mansio-ink/10 text-mansio-mocha'}`}
            >
              {reservation.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs tracking-widest uppercase text-mansio-gold mb-1">
                Guest
              </p>
              <p className="font-medium text-mansio-ink">
                {reservation.guest.user.first_name}{' '}
                {reservation.guest.user.last_name}
              </p>
              <p>{reservation.guest.user.email}</p>
              {reservation.guest.phone_number && (
                <p>{reservation.guest.phone_number}</p>
              )}
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-mansio-gold mb-1">
                Room
              </p>
              <p className="font-medium text-mansio-ink">
                #{reservation.room.room_number}
              </p>
              <p>{reservation.room.room_type.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs tracking-widest uppercase text-mansio-gold mb-1">
                Check-in
              </p>
              <p>{fmt(reservation.check_in_date)}</p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-mansio-gold mb-1">
                Check-out
              </p>
              <p>{fmt(reservation.check_out_date)}</p>
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
                    <span>Remaining</span>
                    <span>€{remaining.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {reservation.checked_in_at && (
            <p className="text-xs text-mansio-taupe">
              Checked in: {fmtTime(reservation.checked_in_at)}
            </p>
          )}

          {error && (
            <p className="text-xs text-red-600">
              {(error as { response?: { data?: { error?: string } } })?.response
                ?.data?.error ?? 'Operation failed.'}
            </p>
          )}

          {canCheckout && remaining > 0 && (
            <div>
              <p className="text-xs tracking-widest uppercase text-mansio-gold mb-1">
                Payment method for balance
              </p>
              <Select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as 'CASH' | 'CARD')
                }
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
              </Select>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-mansio-ink/10 flex gap-3">
          {canCheckin && (
            <Button onClick={handleCheckin} disabled={isPending}>
              {checkin.isPending ? 'Processing…' : 'Check In'}
            </Button>
          )}
          {canNoShow && (
            <Button
              variant="outline"
              onClick={handleNoShow}
              disabled={isPending}
            >
              {noShow.isPending ? 'Processing…' : 'No Show'}
            </Button>
          )}
          {canCheckout && (
            <Button onClick={handleCheckout} disabled={isPending}>
              {checkout.isPending ? 'Processing…' : 'Check Out'}
            </Button>
          )}
          <Button onClick={onClose} disabled={isPending}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
