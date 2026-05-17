import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import {
  Bed,
  BedDouble,
  BookOpen,
  ChevronRight,
  ClipboardList,
  ConciergeBell,
  LayoutDashboard,
  LayoutList,
  LogOut,
  PackagePlus,
  Sparkles,
  SprayCan,
  UserCog,
  Users,
  UtensilsCrossed,
  X,
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
  {
    label: 'Room Types',
    icon: LayoutList,
    path: '/dashboard/room-types',
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST],
  },
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
  {
    label: 'Cleaning Tasks',
    icon: SprayCan,
    path: '/dashboard/cleaning-tasks',
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: 'My Tasks',
    icon: ClipboardList,
    path: '/dashboard/my-tasks',
    roles: [ROLES.HOUSEKEEPING],
  },
  { label: 'Reservations', icon: BookOpen, path: '/dashboard/reservations', roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST] },
  {
    label: 'Users',
    icon: Users,
    path: '/dashboard/users',
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: 'Guests',
    icon: Users,
    path: '/dashboard/guests',
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST],
  },
  {
    label: 'Staff',
    icon: UserCog,
    path: '/dashboard/staff',
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: 'Service Categories',
    icon: ConciergeBell,
    path: '/dashboard/service-categories',
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: 'Extra Services',
    icon: PackagePlus,
    path: '/dashboard/extra-services',
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
  {
    label: 'Meal Plans',
    icon: UtensilsCrossed,
    path: '/dashboard/meal-plans',
    roles: [ROLES.ADMIN, ROLES.MANAGER],
  },
]

interface DashboardSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, hasRole } = useAuth()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col h-full bg-mansio-espresso transition-transform duration-300 md:static md:translate-x-0 md:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="px-5 py-5 border-b border-mansio-gold/15">
        <div className="flex items-center justify-between">
          <Logo size={36} />
          <button onClick={onClose} className="md:hidden text-mansio-gold/50 hover:opacity-70 transition-opacity">
            <X size={18} />
          </button>
        </div>
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
    </>
  )
}
