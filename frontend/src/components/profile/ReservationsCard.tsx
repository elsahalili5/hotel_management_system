import { Link } from '@tanstack/react-router'
import { BedDouble } from 'lucide-react'

export function ReservationsCard() {
  return (
    <div className="bg-mansio-ivory p-8">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase mb-1 text-mansio-gold">History</p>
        <h2 className="font-serif text-2xl text-mansio-espresso">My Reservations</h2>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-mansio-gold/10 flex items-center justify-center mb-6">
          <BedDouble size={22} className="text-mansio-gold" />
        </div>
        <h3 className="font-serif text-xl text-mansio-espresso mb-2">No Reservations Yet</h3>
        <p className="text-sm font-light text-mansio-taupe max-w-xs leading-relaxed mb-8">
          You haven't made any reservations at Mansio. Start planning your perfect stay.
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
    </div>
  )
}
