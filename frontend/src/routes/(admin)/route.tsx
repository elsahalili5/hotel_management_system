import { requireAuthenticated, requireRole } from '#/lib/route-guard';
import { ROLES } from '@mansio/shared';
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(admin)')({
  beforeLoad: ({ context }) => {
    requireAuthenticated(context.auth);
    requireRole(context.auth, { role: [ROLES.ADMIN], redirectTo: "/" });
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
