import { createFileRoute, } from '@tanstack/react-router'
import { useRooms } from '#/modules/rooms/room/hooks/use-rooms'

export const Route = createFileRoute('/dashboard/rooms')({
  component: RouteComponent,
})

function RouteComponent() { 
  const { data: rooms, isLoading } = useRooms();

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!rooms) {
    return <div>No rooms found</div>
  }

  
  return <div>
    <h1>Rooms</h1>
    <ul>
      {rooms.map((room) => (
        <li key={room.id}>{room.room_type.name}</li>
      ))}
    </ul>
  </div>
}
