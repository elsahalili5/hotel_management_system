import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/rooms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/rooms"!</div>
}
