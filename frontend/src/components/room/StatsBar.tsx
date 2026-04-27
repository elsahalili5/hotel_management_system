import { Maximize2, Users, BedDouble } from 'lucide-react'

interface StatsBarProps {
  size?: number | null
  maxOccupancy: number
  price: string | number
  beds: string[]
}

export function StatsBar({ size, maxOccupancy, price, beds }: StatsBarProps) {
  const stats = [
    ...(size ? [{ icon: <Maximize2 size={15} />, value: `${size} m²`, label: 'Room Size' }] : []),
    { icon: <Users size={15} />, value: `${maxOccupancy} Guests`, label: 'Max Occupancy' },
    { icon: null, value: `€${price}`, label: 'Per Night' },
  ]

  return (
    <div className="w-full py-6 px-8 md:px-16 flex flex-wrap items-center justify-center gap-10 md:gap-20 bg-mansio-espresso">
      {stats.map(({ icon, value, label }, i) => (
        <div key={i} className="flex items-center gap-3">
          {icon && <span className="text-mansio-gold">{icon}</span>}
          <div>
            <p className="font-serif text-xl leading-tight text-mansio-cream">{value}</p>
            <p className="text-xs tracking-widest uppercase mt-0.5 text-mansio-taupe">{label}</p>
          </div>
        </div>
      ))}

      {beds.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-mansio-gold">
            <BedDouble size={15} />
          </span>
          <div>
            {beds.map((bed) => (
              <p key={bed} className="font-serif text-xl leading-tight text-mansio-cream">{bed}</p>
            ))}
            <p className="text-xs tracking-widest uppercase mt-0.5 text-mansio-taupe">
              {beds.length > 1 ? 'Bed Types' : 'Bed Type'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
