import type { AuthContextValue } from '#/modules/auth/components/auth-context'
import type { FileRoutesByTo } from '#/routeTree.gen'
import type { RoleType } from '@mansio/shared'
import { redirect } from '@tanstack/react-router'

export function requireAuthenticated(authContext: AuthContextValue) {
  if (!authContext.isAuthenticated) {
    throw redirect({ to: '/login' })
  }
}

type RequireRoleOptions = {
  role: RoleType | RoleType[]
  redirectTo?: keyof FileRoutesByTo
}

export function requireRole(
  authContext: AuthContextValue,
  { role, redirectTo = '/' }: RequireRoleOptions,
) {
  requireAuthenticated(authContext)
  const roles = Array.isArray(role) ? role : [role]
  const hasRequiredRole = roles.some((requiredRole) => authContext.hasRole(requiredRole))

  if (!hasRequiredRole) {
    throw redirect({ to: redirectTo })
  }
}
