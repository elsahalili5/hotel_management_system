import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'

import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const hideLayout = ['/login', '/signup', '/dashboard'].includes(
    location.pathname,
  )

  return (
    <>
      {!hideLayout && <Header />}
      <Outlet />
      {!hideLayout && <Footer />}
    </>
  )
}
