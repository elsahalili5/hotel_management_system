import { ProfileHeader } from '#/components/profile/ProfileHeader'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Container } from '#/components/Container'
import { CallToAction } from '#/components/CallToAction'
import { PersonalInfoCard } from '#/components/profile/PersonalInfoCard'
import { ReservationsCard } from '#/components/profile/ReservationsCard'
// import { TravelDocumentCard } from '#/components/profile/TravelDocumentCard'
import { QuickStatsCard } from '#/components/profile/QuickStatsCard'
import { requireAuthenticated } from '#/lib/route-guard'
import { useAuth } from '#/modules/auth/hooks/use-auth'
import { formatDate } from '#/lib/dates'

export const Route = createFileRoute('/(app)/(private)/profile')({
    beforeLoad: ({ context }) => {
        requireAuthenticated(context.auth);
    },
    component: RouteComponent,
})


function RouteComponent() {
    const auth = useAuth();
    const navigate = useNavigate()
    const user = auth.user;
    const memberSince = formatDate(user?.created_at) ?? 'N/A'
    const handleLogout = () => {
      auth.logout()
      navigate({ to: '/login' })
    }

    if(!user) {
        return null;
    }
    return (
      <main className="min-h-screen bg-mansio-cream">
  
        <ProfileHeader
          user={user}
          onLogout={handleLogout}
        />
  
        <div className="h-px bg-mansio-gold/20" />
  
        <Container className="py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
  
          <div className="lg:col-span-2 flex flex-col gap-6">
            <PersonalInfoCard user={user} />
            <ReservationsCard />
          </div>
  
          <div className="flex flex-col gap-6">
            {/* <TravelDocumentCard passportNumber={user.} /> */}
            <QuickStatsCard
              memberSince={memberSince}
              country={"-"}
              totalStays={"-"}
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
  