import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/reviews')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/reviews"!</div>
}
