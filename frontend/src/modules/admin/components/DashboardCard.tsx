import type { ReactNode } from 'react'

interface DashboardCardProps {
  children: ReactNode
  className?: string
  dark?: boolean
}

export function DashboardCard({ children, className = '', dark = false }: DashboardCardProps) {
  return (
    <div className={`rounded-xl border ${dark ? 'bg-mansio-espresso border-mansio-gold/15' : 'bg-mansio-cream border-mansio-ink/10'} ${className}`}>
      {children}
    </div>
  )
}