import { createFileRoute, Link } from '@tanstack/react-router'
import { HeroSection } from '#/components/HeroSection'
import { Button } from '#/components/Button'
import { StatsBar } from '#/components/room/StatsBar'
import { RoomGallery } from '#/components/room/RoomGallery'
import { RoomAmenities } from '#/components/room/RoomAmenities'
import { BookingCard } from '#/components/room/BookingCard'
import { PoliciesStrip } from '#/components/room/PoliciesStrip'
import { CallToAction } from '#/components/CallToAction'
import { Container } from '#/components/Container'
import { ChevronLeft } from 'lucide-react'
import { useRoomTypeById } from '#/modules/rooms/room-type/hooks/use-room-types'

export const Route = createFileRoute('/(app)/rooms/$roomTypeId')({
  component: RoomDetail,
})

function RoomDetail() {
  const { roomTypeId } = Route.useParams()
  const { data: room, isLoading, isError } = useRoomTypeById(Number(roomTypeId))

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-mansio-taupe">Loading...</p>
      </main>
    )
  }

  if (isError || !room) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load room details.</p>
      </main>
    )
  }

  const primaryImage =
    room.images.find((img) => img.is_primary) ?? room.images[0]
  const galleryImages = room.images
    .filter((img) => !img.is_primary)
    .map((img) => img.url)
  const beds = room.beds.map((b) => `${b.quantity}x ${b.bed.name}`)
  const amenities = room.amenities.map((a) => ({
    label: a.amenity.name,
    iconName: a.amenity.icon,
  }))

  return (
    <main className="min-h-screen bg-mansio-cream">
      <div className="relative">
        <HeroSection
          image={
            primaryImage?.url ??
            'https://epidamn.com/assets/images/pamjedhoma.jpg'
          }
          title={room.name}
          height="500px"
        />
        <Link to="/rooms" className="no-underline absolute top-8 left-8 z-20">
          <Button
            variant="ghost"
            startIcon={<ChevronLeft size={14} />}
            color="var(--color-mansio-cream)"
          >
            All Rooms
          </Button>
        </Link>
      </div>

      <StatsBar
        size={room.size_m2}
        maxOccupancy={room.max_occupancy}
        price={room.base_price}
        beds={beds}
      />

      <Container className="py-16 md:py-24 grid grid-cols-1 lg:grid-cols-3 gap-14 lg:gap-20">
        <div className="lg:col-span-2 flex flex-col gap-16">
          {room.description && (
            <div>
              <p className="text-xs tracking-widest uppercase mb-3 text-mansio-gold">
                About This Room
              </p>
              <h2 className="font-serif text-3xl md:text-4xl mb-8 text-mansio-espresso">
                An Experience Like No Other
              </h2>
              <div className="h-px w-16 mb-8 bg-mansio-gold" />
              <p className="text-base leading-relaxed font-light text-mansio-mocha">
                {room.description}
              </p>
            </div>
          )}

          {galleryImages.length > 0 && (
            <RoomGallery images={galleryImages} roomName={room.name} />
          )}

          {amenities.length > 0 && <RoomAmenities amenities={amenities} />}
        </div>

        <div className="lg:col-span-1">
          <BookingCard price={room.base_price} />
        </div>
      </Container>

      <PoliciesStrip />

      <CallToAction
        kicker="Reserve Your Stay"
        title="Ready to Experience Mansio?"
        description="Our team is here to ensure every detail of your stay exceeds your expectations."
        buttonLabel="Book Now"
        buttonTo="/login"
      />
    </main>
  )
}
