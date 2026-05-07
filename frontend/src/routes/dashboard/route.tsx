import { requireAuthenticated, requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import { DashboardHeader } from '#/modules/admin/components/DashboardHeader'
import { DashboardSidebar } from '#/modules/admin/components/DashboardSidebar'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    requireAuthenticated(context.auth)
    requireRole(context.auth, { role: [ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST,ROLES.HOUSEKEEPING], redirectTo: '/' })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex h-screen overflow-hidden bg-mansio-linen">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader title="Overview" subtitle={today} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto py-7 px-7 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}