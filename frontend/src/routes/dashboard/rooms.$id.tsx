import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/rooms/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/rooms/$id"!</div>
}
