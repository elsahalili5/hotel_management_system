import { useGuest } from '#/modules/guest/hooks/use-guests'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/guests/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const guestId = Number(id)
  const guestQuery = useGuest(guestId)

  if (guestQuery.isLoading) {
    return <div>Loading guest data...</div>
  }

  if (guestQuery.isError || !guestQuery.data) {
    return <div>Failed to load guest data: {guestQuery.error?.message}</div>
  }

  const guest = guestQuery.data

  return (
    <div>
      <h1>
        {guest.user.first_name} {guest.user.last_name}

        {guest.address}
      </h1>
    </div>
  )
}
    