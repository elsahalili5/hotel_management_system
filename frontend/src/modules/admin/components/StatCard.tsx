import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { DashboardCard } from './DashboardCard'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  change: string
  up: boolean
}

export function StatCard({ label, value, icon: Icon, change, up }: StatCardProps) {
  return (
    <DashboardCard className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--ivory)' }}>
          <Icon size={15} style={{ color: 'var(--gold-deep)' }} />
        </div>
        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          {up ? (
            <TrendingUp size={11} style={{ color: '#16a34a' }} />
          ) : (
            <TrendingDown size={11} style={{ color: '#dc2626' }} />
          )}
          {change}
        </span>
      </div>
      <p className="text-2xl font-serif mb-1" style={{ color: 'var(--text)' }}>
        {value}
      </p>
      <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
    </DashboardCard>
  )
}
