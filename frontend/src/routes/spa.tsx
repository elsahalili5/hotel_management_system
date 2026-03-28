import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/spa')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/spa"!</div>
}
