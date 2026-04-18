import { createFileRoute, Link } from '@tanstack/react-router'
import { HeroSection } from '../components/HeroSection'
import { Button } from '../components/Button'
import { StatsBar } from '../components/room/StatsBar'
import { RoomGallery } from '../components/room/RoomGallery'
import { RoomAmenities, type Amenity } from '../components/room/RoomAmenities'
import { BookingCard } from '../components/room/BookingCard'
import { PoliciesStrip } from '../components/room/PoliciesStrip'
import { CallToAction } from '../components/CallToAction'
import { Container } from '../components/Container'
import {
  Wifi,
  Tv,
  Wind,
  Shield,
  Coffee,
  Droplets,
  Eye,
  Waves,
  ChevronLeft,
} from 'lucide-react'

export const Route = createFileRoute('/rooms/$roomTypeId')({
  component: RoomDetail,
})

const room = {
  name: 'Deluxe Sea View',
  tagline: 'Wake up to breathtaking horizons',
  description: [
    'The Deluxe Sea View room is our most sought-after accommodation, offering panoramic views of the Adriatic and an elevated sense of luxury that begins the moment you step through the door.',
    'Designed with a refined palette of natural textures and warm tones, this room invites you to slow down and savor every moment. Floor-to-ceiling windows frame the sea like a living painting, while the private balcony offers an intimate space to breathe in the coastal air.',
    'Every detail has been carefully considered — from the handcrafted linens to the curated selection of local products in your minibar. At Mansio, luxury is not an addition; it is the foundation.',
  ],
  price: 185,
  size: 35,
  maxOccupancy: 2,
  beds: ['1 King Bed', '1 Sofa Bed'],
  images: [
    'https://epidamn.com/assets/images/pamjedhoma.jpg',
    'https://epidamn.com/assets/images/inside.png',
    'https://epidamn.com/assets/images/inside.jpg',
  ],
  amenities: [
    { label: 'High-Speed Wi-Fi', Icon: Wifi },
    { label: 'Smart TV', Icon: Tv },
    { label: 'Air Conditioning', Icon: Wind },
    { label: 'In-Room Safe', Icon: Shield },
    { label: 'Minibar', Icon: Coffee },
    { label: 'Private Balcony', Icon: Eye },
    { label: 'Sea View', Icon: Waves },
    { label: 'Organic Amenities', Icon: Droplets },
  ] satisfies Amenity[],
  included: [
    'Daily breakfast for two',
    'Complimentary Wi-Fi',
    'Access to Spa & Pool',
    'Welcome drink on arrival',
    'Daily housekeeping',
    'Concierge service',
  ],
}

function RoomDetail() {
  return (
    <main className="min-h-screen bg-mansio-cream">

      <div className="relative">
        <HeroSection
          image={room.images[0]}
          title={room.name}
          subtitle={room.tagline}
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
        size={room.size}
        maxOccupancy={room.maxOccupancy}
        price={room.price}
        beds={room.beds}
      />

      <Container className="py-16 md:py-24 grid grid-cols-1 lg:grid-cols-3 gap-14 lg:gap-20">

        <div className="lg:col-span-2 flex flex-col gap-16">

          <div>
            <p className="text-xs tracking-widest uppercase mb-3 text-mansio-gold">
              About This Room
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mb-8 text-mansio-espresso">
              An Experience Like No Other
            </h2>
            <div className="h-px w-16 mb-8 bg-mansio-gold" />
            <div className="flex flex-col gap-5">
              {room.description.map((para, i) => (
                <p key={i} className="text-base leading-relaxed font-light text-mansio-mocha">
                  {para}
                </p>
              ))}
            </div>
          </div>

          <RoomGallery images={room.images} roomName={room.name} />

          <RoomAmenities amenities={room.amenities} />
        </div>

        <div className="lg:col-span-1">
          <BookingCard price={room.price} included={room.included} />
        </div>
      </Container>

      <PoliciesStrip />

      <CallToAction
        kicker="Reserve Your Stay"
        title="Ready to Experience Mansio?"
        description="Our team is here to ensure every detail of your stay exceeds your expectations."
        buttonLabel="Book Now"
        buttonTo="/contact"
      />
    </main>
  )
}
