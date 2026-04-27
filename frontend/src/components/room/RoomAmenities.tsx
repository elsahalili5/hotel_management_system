import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type Amenity = { label: string; iconName?: string | null; Icon?: LucideIcon }

interface RoomAmenitiesProps {
  amenities: Amenity[]
}

export function RoomAmenities({ amenities }: RoomAmenitiesProps) {
  return (
    <div>
      <p className="text-xs tracking-widest uppercase mb-3 text-mansio-gold">Amenities</p>
      <h3 className="font-serif text-3xl mb-8 text-mansio-espresso">Everything You Need</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-mansio-ink/10">
        {amenities.map(({ label, iconName, Icon: StaticIcon }) => {
          const Icon = StaticIcon ?? (Icons as unknown as Record<string, LucideIcon>)[iconName ?? ''] ?? Icons.Sparkles

          return (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-3 py-8 px-4 text-center bg-mansio-ivory"
            >
              <span className="text-mansio-gold">
                <Icon size={18} />
              </span>
              <span className="text-xs tracking-wide leading-snug text-mansio-espresso">{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
