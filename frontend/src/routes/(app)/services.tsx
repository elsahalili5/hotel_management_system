import { createFileRoute } from '@tanstack/react-router'
import { Clock, Sparkles } from 'lucide-react'
import { HeroSection } from '#/components/HeroSection'
import { CallToAction } from '#/components/CallToAction'
import { Container } from '#/components/Container'
import { useExtraServices } from '#/modules/extra-services/extra-service/hooks/use-extra-services'
import type { ExtraServiceResponse } from '@mansio/shared'

export const Route = createFileRoute('/(app)/services')({
  component: ServicesPage,
})

function ServicesPage() {
  const { data: services = [], isLoading } = useExtraServices()

  const active = services.filter((s) => s.is_active)

  const grouped = active.reduce<Record<string, ExtraServiceResponse[]>>(
    (acc, service) => {
      const cat = service.category.name
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(service)
      return acc
    },
    {},
  )

  return (
    <main className="min-h-screen bg-mansio-cream">
      <HeroSection
        image="https://confident-health-b88439dafa.media.strapiapp.com/medium_SPA_2_9410954b4d.jpg"
        title="Extra Services"
        subtitle="Tailored to Elevate Your Stay"
        height="500px"
      />

      <div className="bg-mansio-espresso py-12 text-center px-4">
        <p className="text-xs tracking-widest uppercase text-mansio-gold mb-3">
          At Your Service
        </p>
        <p className="text-mansio-linen font-light text-base max-w-2xl mx-auto leading-relaxed">
          Every detail of your stay at Mansio can be personalised. Browse our
          curated selection of premium extras and let us arrange everything
          before you arrive.
        </p>
      </div>

      <Container className="py-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-mansio-taupe">
            <Sparkles size={24} className="animate-pulse text-mansio-gold" />
            <p className="text-sm tracking-wide">Loading services…</p>
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="text-center text-mansio-taupe py-24 text-sm">
            No services available at the moment.
          </p>
        ) : (
          <div className="flex flex-col gap-20">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-6 mb-10">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-mansio-gold mb-1">
                      {category}
                    </p>
                    <div className="h-px w-10 bg-mansio-gold" />
                  </div>
                  <div className="flex-1 h-px bg-mansio-ink/10" />
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>

      <CallToAction
        kicker="Personalise Your Stay"
        title="Ready to Reserve?"
        description="Book your room and let our concierge team arrange your selected services before you arrive."
        buttonLabel="Book Now"
        buttonTo="/rooms"
      />
    </main>
  )
}

function ServiceCard({ service }: { service: ExtraServiceResponse }) {
  const availability = service.is_available_24h
    ? '24h Available'
    : service.available_from && service.available_until
      ? `${service.available_from} – ${service.available_until}`
      : null

  return (
    <div className="group flex flex-col bg-mansio-ivory border border-mansio-ink/8 hover:border-mansio-gold/40 transition-colors duration-300">
      <div className="h-0.5 w-0 bg-mansio-gold group-hover:w-full transition-all duration-500" />

      <div className="flex flex-col gap-4 p-7 flex-1">
        <div className="flex items-start justify-between gap-4">
          <h4 className="font-serif text-xl text-mansio-espresso leading-snug">
            {service.name}
          </h4>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-mansio-gold font-semibold text-lg leading-none">
              €{service.price}
            </span>
            <span className="text-xs text-mansio-taupe font-light mt-0.5">
              per request
            </span>
          </div>
        </div>

        {service.description && (
          <p className="text-sm font-light leading-relaxed text-mansio-mocha flex-1">
            {service.description}
          </p>
        )}

        {availability && (
          <div className="flex items-center gap-2 pt-3 border-t border-mansio-ink/8">
            <Clock size={11} className="text-mansio-gold shrink-0" />
            <span className="text-xs tracking-wide text-mansio-taupe">
              {availability}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
