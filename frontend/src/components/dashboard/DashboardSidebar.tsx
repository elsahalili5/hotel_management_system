import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import {
  BedDouble,
  BookOpen,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Star,
  UserCog,
  Users,
} from 'lucide-react'
import { Logo } from '../Logo'
import { useAuth } from '#/modules/auth/auth-context';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' as const },
  { label: 'Rooms', icon: BedDouble, path: '/rooms' as const },
  { label: 'Bookings', icon: BookOpen, path: '/bookings' as const },
  { label: 'Guests', icon: Users, path: null },
  { label: 'Staff', icon: UserCog, path: null },
  { label: 'Reviews', icon: Star, path: null },
]

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    navigate({ to: '/login', replace: true });
  }

  return (
    <aside
      className="w-60 flex flex-col shrink-0 h-full"
      style={{ backgroundColor: 'var(--color-mansio-espresso)' }}
    >
      <div
        className="px-5 py-5 border-b"
        style={{ borderColor: 'rgba(196, 168, 130, 0.15)' }}
      >
        <Logo size={36} />
        <p
          className="text-xs tracking-widest uppercase mt-2 font-medium"
          style={{ color: 'rgba(196, 168, 130, 0.6)' }}
        >
          Management
        </p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.path !== null && location.pathname === item.path
          return item.path ? (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full"
              style={
                isActive
                  ? {
                      backgroundColor: 'rgba(196, 168, 130, 0.15)',
                      color: 'var(--color-mansio-gold)',
                    }
                  : { color: 'rgba(212, 196, 168, 0.6)' }
              }
            >
              <item.icon size={15} className="shrink-0" />
              {item.label}
              {isActive && (
                <ChevronRight
                  size={12}
                  className="ml-auto"
                  style={{ color: 'var(--color-mansio-gold)' }}
                />
              )}
            </Link>
          ) : (
            <button
              key={item.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left hover:opacity-80"
              style={{ color: 'rgba(212, 196, 168, 0.6)' }}
            >
              <item.icon size={15} className="shrink-0" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div
        className="px-3 py-4 border-t"
        style={{ borderColor: 'rgba(196, 168, 130, 0.15)' }}
      >
        <button
        onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-all duration-200 hover:opacity-70"
          style={{ color: 'rgba(212, 196, 168, 0.5)' }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
