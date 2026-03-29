import { Outlet, createRootRoute } from '@tanstack/react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'

import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer/>
    </>
  )
}
