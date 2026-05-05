import { requireAuthenticated, requireRole } from '#/lib/route-guard';
import { ROLES } from '@mansio/shared';
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DashboardHeader } from '#/modules/admin/components/DashboardHeader'
import { DashboardSidebar } from '#/modules/admin/components/DashboardSidebar'
 
export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    requireAuthenticated(context.auth);
    requireRole(context.auth, { role: [ROLES.ADMIN], redirectTo: "/" });
  },
  component: RouteComponent,
})


function RouteComponent() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg)', fontFamily: 'var(--font-sans)' }}
    >
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Overview" subtitle={today} />
        <main className="flex-1 overflow-y-auto py-7 px-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
