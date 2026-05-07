import { requireAuthenticated } from '#/lib/route-guard';
import { ROLES } from '@mansio/shared';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(private)')({
  beforeLoad: ({ context }) => {
    requireAuthenticated(context.auth);

    if (!context.auth.hasRole(ROLES.GUEST)) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
