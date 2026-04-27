import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/gentrit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/gentwefewfewrit"!</div>
}
