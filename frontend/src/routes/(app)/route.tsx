import { createFileRoute, Outlet } from '@tanstack/react-router'
import Footer from '#/components/Footer'
import Header from '#/components/Header'
// import { requireAuthenticated } from '#/lib/route-guard'
// import { ROLES } from '@mansio/shared'


export const Route = createFileRoute('/(app)')({
  beforeLoad: ({ context }) => {
    // requireAuthenticated(context.auth)

    // if(context.auth.hasRole(ROLES.ADMIN)) {
    //   throw redirect({ to: '/dashboard' })
    // }
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
