import { Bell } from 'lucide-react'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <header
      className="shrink-0 flex items-center justify-between px-8 py-4 border-b"
      style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--border)' }}
    >
      <div>
        <h1 className="font-serif text-xl" style={{ color: 'var(--text)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative p-2 rounded-full transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--gold)' }}
          />
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{
            backgroundColor: 'var(--color-mansio-espresso)',
            color: 'var(--color-mansio-cream)',
          }}
        >
          M
        </div>
      </div>
    </header>
  )
}
