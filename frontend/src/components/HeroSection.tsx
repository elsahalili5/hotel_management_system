interface HeroSectionProps {
  image: string
  title: string
  subtitle?: string
}

export function HeroSection({ image, title, subtitle }: HeroSectionProps) {
  return (
    <section
      className="relative h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />

      <div className="relative z-10 text-center px-6">
        <h1
          className="text-5xl md:text-7xl font-normal mb-4"
          style={{ fontFamily: 'var(--font-serif)', color: '#F7F2EA' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-lg md:text-2xl font-light"
            style={{ fontFamily: 'var(--font-serif)', color: 'rgba(247, 242, 234, 0.85)' }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
