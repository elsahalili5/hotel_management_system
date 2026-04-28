import {
  createFileRoute,
  Outlet,
  useChildMatches,
} from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { HeroSection } from '#/components/HeroSection'
import { TextSection } from '#/components/TextSection'
import { SplitSection } from '#/components/SplitSection'
import { useRoomTypes } from '#/modules/rooms/room-type/hooks/use-room-types'

export const Route = createFileRoute('/(app)/rooms')({
  component: Rooms,
})

function Rooms() {
  const childMatches = useChildMatches()
  const { data: roomTypes, isLoading, isError } = useRoomTypes()

  if (childMatches.length > 0) {
    return <Outlet />
  }

  return (
    <main className="min-h-screen">
      <HeroSection
        height="500px"
        title="ROOMS"
        subtitle="Your Home Away From Home"
        image="https://epidamn.com/assets/images/pamjedhoma.jpg"
      />

      <TextSection
        subtitle="Comfort Redefined"
        paragraphs={[
          'At Mansio, every room is a sanctuary — a carefully composed space where warmth, elegance, and ease come together. Whether you are here for a night or a week, you will find everything you need to feel completely at home.',
          'From our thoughtfully designed Standard Rooms to our expansive Suites, each space has been curated with the finest materials and attention to detail, ensuring a restful and refined experience for every guest.',
        ]}
      />

      {isLoading && (
        <p className="text-center text-mansio-taupe py-16">Loading rooms...</p>
      )}

      {isError && (
        <p className="text-center text-red-500 py-16">
          Failed to load rooms. Please try again.
        </p>
      )}

      {roomTypes?.length === 0 && (
        <p className="text-center text-mansio-taupe py-16">
          No rooms available at the moment.
        </p>
      )}

      {roomTypes?.map((room, index) => {
        const primaryImage =
          room.images.find((img) => img.is_primary) ?? room.images[0]

        return (
          <SplitSection
            key={room.id}
            title={room.name}
            text={
              room.description ??
              `From $${room.base_price} / night · Up to ${room.max_occupancy} guests${room.size_m2 ? ` · ${room.size_m2} m²` : ''}`
            }
            image={
              primaryImage?.url ??
              'https://www.epidamn.com/assets/images/room1.jpg'
            }
            buttonLabel="See More"
            buttonTo={`/rooms/${room.id}`}
            buttonEndIcon={<ArrowRight size={20} />}
            imageRight={index % 2 === 0}
          />
        )
      })}
    </main>
  )
}
