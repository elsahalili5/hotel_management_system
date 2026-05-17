import { CheckCircle } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface Props {
  reservationId: number
  roomTypeName: string
  checkIn: string
  checkOut: string
  nights: number
  total: number
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-mansio-mocha">{label}</span>
    <span className="text-mansio-espresso">{value}</span>
  </div>
)

export function BookingSuccess({
  reservationId,
  roomTypeName,
  checkIn,
  checkOut,
  nights,
  total,
}: Props) {
  return (
    <div className="flex flex-col items-center text-center gap-6">
      <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
        <CheckCircle size={28} className="text-green-500" />
      </div>

      <div>
        <p className="text-xs tracking-widest uppercase text-mansio-gold mb-2">
          Booking Confirmed
        </p>
        <h2 className="font-serif text-2xl text-mansio-espresso">
          Your reservation is confirmed
        </h2>
        <p className="text-sm text-mansio-mocha mt-1">
          Reservation #{reservationId}
        </p>
      </div>

      <div className="w-full bg-mansio-ivory border border-mansio-ink/8 rounded p-5 text-left flex flex-col gap-3">
        <Row label="Room" value={roomTypeName} />
        <Row label="Check-in" value={fmt(checkIn)} />
        <Row label="Check-out" value={fmt(checkOut)} />
        <Row
          label="Duration"
          value={`${nights} night${nights !== 1 ? 's' : ''}`}
        />
        <div className="h-px bg-mansio-ink/8" />
        <div className="flex justify-between text-sm font-medium">
          <span className="text-mansio-espresso">Total Paid</span>
          <span className="text-mansio-espresso">€{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <Link to="/profile" className="no-underline flex-1">
          <button className="w-full py-2.5 text-xs font-medium tracking-widest uppercase border border-mansio-espresso text-mansio-espresso rounded-full hover:opacity-70 transition-opacity">
            My Reservations
          </button>
        </Link>
        <Link to="/rooms" className="no-underline flex-1">
          <button className="w-full py-2.5 text-xs font-medium tracking-widest uppercase bg-mansio-espresso text-mansio-cream rounded-full hover:opacity-80 transition-opacity">
            Explore Rooms
          </button>
        </Link>
      </div>
    </div>
  )
}
