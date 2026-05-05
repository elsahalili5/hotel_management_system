import { createFileRoute } from '@tanstack/react-router'
import { useGuests } from '#/modules/guest/hooks/use-guests'

export const Route = createFileRoute('/dashboard/guests')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: guests, isLoading } = useGuests()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!guests) {
    return <div>No guests found</div>
  }

  return <div>
    <h1>Guests</h1>
    <ul>
      {guests.map((guest) => (
        <li key={guest.id}>{guest.user.first_name} {guest.user.last_name}</li>
      ))}
    </ul>
  </div>
}
