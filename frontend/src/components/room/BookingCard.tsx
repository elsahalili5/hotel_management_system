import { Link } from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'

const INCLUDED = [
  'Daily breakfast for two',
  'Complimentary Wi-Fi',
  'Access to Spa & Pool',
  'Welcome drink on arrival',
  'Daily housekeeping',
  'Concierge service',
]

interface BookingCardProps {
  price: string | number
}

export function BookingCard({ price }: BookingCardProps) {
  return (
    <div className="sticky top-28 flex flex-col gap-6 p-8 bg-mansio-espresso border border-mansio-gold/15">
      <div>
        <p className="text-xs tracking-widest uppercase mb-1 text-mansio-gold">Starting From</p>
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-5xl text-mansio-cream">€{price}</span>
          <span className="text-sm font-light text-mansio-taupe">/ night</span>
        </div>
      </div>

      <div className="h-px w-full bg-mansio-gold/15" />

      <div>
        <p className="text-xs tracking-widest uppercase mb-4 text-mansio-gold">What's Included</p>
        <div className="flex flex-col gap-3">
          {INCLUDED.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <Check size={12} className="text-mansio-gold shrink-0" />
              <span className="text-sm font-light text-mansio-linen">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-mansio-gold/15" />

      <div className="flex flex-col gap-3">
        <Link to="/login" className="no-underline">
          <button className="w-full flex items-center justify-center gap-2 py-4 text-xs font-medium tracking-widest uppercase transition-opacity duration-200 hover:opacity-80 bg-mansio-gold text-mansio-espresso">
            Reserve This Room
            <ArrowRight size={13} />
          </button>
        </Link>
        <Link to="/rooms" className="no-underline">
          <button className="w-full flex items-center justify-center gap-2 py-3 text-xs font-medium tracking-widest uppercase transition-opacity duration-200 hover:opacity-60 bg-transparent text-mansio-linen border border-mansio-gold/25">
            View All Rooms
          </button>
        </Link>
        <Link to="/services" className="no-underline">
          <button className="w-full flex items-center justify-center gap-2 py-3 text-xs font-medium tracking-widest uppercase transition-opacity duration-200 hover:opacity-60 bg-transparent text-mansio-linen border border-mansio-gold/25">
            Extra Services
          </button>
        </Link>
      </div>
    </div>
  )
}
