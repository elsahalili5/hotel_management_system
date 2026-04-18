import type { LucideIcon } from 'lucide-react'
import { Clock, CalendarCheck, Ban } from 'lucide-react'

interface Policy {
  Icon: LucideIcon
  title: string
  value: string
}

const DEFAULT_POLICIES: Policy[] = [
  { Icon: Clock, title: 'Check-In', value: 'From 3:00 PM' },
  { Icon: CalendarCheck, title: 'Check-Out', value: 'Until 11:00 AM' },
  { Icon: Ban, title: 'Cancellation', value: 'Free up to 48h prior' },
]

interface PoliciesStripProps {
  policies?: Policy[]
}

export function PoliciesStrip({ policies = DEFAULT_POLICIES }: PoliciesStripProps) {
  return (
    <div className="w-full py-12 px-6 md:px-16 bg-mansio-ivory border-y border-mansio-ink/10">
      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {policies.map(({ Icon, title, value }) => (
          <div key={title} className="flex items-center gap-4">
            <span className="text-mansio-gold">
              <Icon size={18} />
            </span>
            <div>
              <p className="text-xs tracking-widest uppercase mb-1 text-mansio-taupe">{title}</p>
              <p className="text-sm font-medium text-mansio-espresso">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
