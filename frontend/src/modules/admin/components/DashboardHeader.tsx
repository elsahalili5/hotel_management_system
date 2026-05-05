import { useAuth } from '#/modules/auth/hooks/use-auth'
import { getUserInitials } from '#/lib/helpers'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { user } = useAuth()

  return (
    <header className="shrink-0 flex items-center justify-between px-8 py-4 border-b border-mansio-ink/10 bg-mansio-cream">
      <div>
        <h1 className="font-serif text-xl text-mansio-ink">{title}</h1>
        {subtitle && <p className="text-xs mt-0.5 text-mansio-mocha">{subtitle}</p>}
      </div>

      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-mansio-espresso text-mansio-cream">
        {getUserInitials(user)}
      </div>
    </header>
  )
}