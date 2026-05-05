import type { ReactNode } from 'react'

interface DashboardCardProps {
  children: ReactNode
  className?: string
  dark?: boolean
}

export function DashboardCard({ children, className = '', dark = false }: DashboardCardProps) {
  return (
    <div
      className={`rounded-xl border ${className}`}
      style={
        dark
          ? {
              backgroundColor: 'var(--color-mansio-espresso)',
              borderColor: 'rgba(196,168,130,0.15)',
            }
          : {
              backgroundColor: 'var(--cream)',
              borderColor: 'var(--border)',
            }
      }
    >
      {children}
    </div>
  )
}
