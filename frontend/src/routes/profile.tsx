import { createFileRoute } from '@tanstack/react-router'
import { Container } from '../components/Container'
import { CallToAction } from '../components/CallToAction'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { PersonalInfoCard } from '../components/profile/PersonalInfoCard'
import { ReservationsCard } from '../components/profile/ReservationsCard'
import { TravelDocumentCard } from '../components/profile/TravelDocumentCard'
import { QuickStatsCard } from '../components/profile/QuickStatsCard'

export const Route = createFileRoute('/profile')({
  component: GuestProfile,
})

const guest = {
  firstName: 'Anjesa',
  lastName: 'Halili',
  email: 'anjesa@temto.ai',
  status: 'ACTIVE',
  memberSince: 'March 2024',
  phone: '+383 44 123 456',
  address: 'Rr. Fehmi Agani 12',
  city: 'Prishtinë',
  country: 'Kosovo',
  dateOfBirth: '15 April 1998',
  passportNumber: 'XK••••••••',
}

function GuestProfile() {
  return (
    <main className="min-h-screen bg-mansio-cream">

      <ProfileHeader
        firstName={guest.firstName}
        lastName={guest.lastName}
        email={guest.email}
        status={guest.status}
        memberSince={guest.memberSince}
      />

      <div className="h-px bg-mansio-gold/20" />

      <Container className="py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 flex flex-col gap-6">
          <PersonalInfoCard guest={guest} />
          <ReservationsCard />
        </div>

        <div className="flex flex-col gap-6">
          <TravelDocumentCard passportNumber={guest.passportNumber} />
          <QuickStatsCard
            memberSince={guest.memberSince}
            country={guest.country}
            totalStays={0}
          />
        </div>

      </Container>

      <CallToAction
        kicker="Ready to Stay?"
        title="Book Your Next Visit"
        description="Explore our rooms and reserve your perfect Mansio experience."
        buttonLabel="View Rooms"
        buttonTo="/rooms"
      />
    </main>
  )
}
