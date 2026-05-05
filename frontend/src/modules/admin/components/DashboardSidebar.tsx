import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import {
  Bed,
  BedDouble,
  BookOpen,
  ChevronRight,
  LayoutDashboard,
  LayoutList,
  LogOut,
  Sparkles,
  Star,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Logo } from '#/components/Logo'
import { useAuth } from '#/modules/auth/hooks/use-auth'
import { ROLES, type RoleType } from '@mansio/shared'
import type { FileRoutesByTo } from '#/routeTree.gen'

type NavItem = {
  label: string
  icon: LucideIcon
  path: keyof FileRoutesByTo
  roles?: RoleType[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  {
    label: 'Rooms',
    icon: BedDouble,
    path: '/dashboard/rooms',
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  { label: 'Room Types', icon: LayoutList, path: '/dashboard/room-types' },
  {
    label: 'Beds',
    icon: Bed,
    path: '/dashboard/beds',
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: 'Amenities',
    icon: Sparkles,
    path: '/dashboard/amenities',
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  { label: 'Bookings', icon: BookOpen, path: '/dashboard/bookings' },
  { label: 'Guests', icon: Users, path: '/dashboard/guests' },
  { label: 'Staff', icon: UserCog, path: '/dashboard/staff' },
  { label: 'Reviews', icon: Star, path: '/dashboard/reviews' },
]

export function DashboardSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, hasRole } = useAuth()

  return (
    <aside className="w-60 flex flex-col shrink-0 h-full bg-mansio-espresso">
      <div className="px-5 py-5 border-b border-mansio-gold/15">
        <Logo size={36} />
        <p className="text-xs tracking-widest uppercase mt-2 font-medium text-mansio-gold/60">
          Management
        </p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {navItems
          .filter((item) => !item.roles || item.roles.some((r) => hasRole(r)))
          .map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full ${isActive ? 'bg-mansio-gold/15 text-mansio-gold' : 'text-mansio-gold/60 hover:text-mansio-gold/80'}`}
              >
                <item.icon size={15} className="shrink-0" />
                {item.label}
                {isActive && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            )
          })}
      </nav>

      <div className="px-3 py-4 border-t border-mansio-gold/15">
        <button
          onClick={() => {
            logout()
            navigate({ to: '/login', replace: true })
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-mansio-gold/50 hover:opacity-70 transition-opacity"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
