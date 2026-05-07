import { Clock, Globe, BedDouble } from 'lucide-react'

interface QuickStatsCardProps {
  memberSince: string
  totalStays?: string
}

export function QuickStatsCard({
  memberSince,
  totalStays,
}: QuickStatsCardProps) {
  const stats = [
    { Icon: Clock, label: 'Member Since', value: memberSince },
    { Icon: BedDouble, label: 'Total Stays', value: String(totalStays) },
  ]

  return (
    <div className="bg-mansio-espresso p-8">
      <p className="text-xs tracking-widest uppercase mb-6 text-mansio-gold">
        Overview
      </p>
      <div className="flex flex-col gap-6">
        {stats.map(({ Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4">
            <Icon size={16} className="text-mansio-gold shrink-0" />
            <div>
              <p className="text-xs tracking-widest uppercase text-mansio-taupe">
                {label}
              </p>
              <p className="text-sm font-medium text-mansio-cream mt-0.5">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
