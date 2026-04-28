import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import Footer from '#/components/Footer'
import Header from '#/components/Header'
export const Route = createFileRoute('/(app)')({
  beforeLoad: ({ context, location }) => {
    const publicPaths = [
      '/',
      '/rooms',
      '/about',
      '/restaurant',
      '/spa',
      '/contact',
    ]
    const isPublic = publicPaths.some((p) => location.pathname.startsWith(p))
    if (!context.auth.isAuthenticated && !isPublic) {
      throw redirect({ to: '/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
