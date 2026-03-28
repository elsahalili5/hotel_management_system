import { Button } from './Button'
import { Container } from './Container'

interface SplitSectionProps {
  title: string
  text: string
  image: string
  buttonLabel?: string
  buttonTo?: string
  imageRight?: boolean
}

export function SplitSection({
  title,
  text,
  image,
  buttonLabel = 'Discover More',
  buttonTo = '/about',
  imageRight = true,
}: SplitSectionProps) {
  const textCol = (
    <div className="flex flex-col justify-center gap-6">
      <h2
        className="text-4xl md:text-5xl font-normal leading-tight"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-mansio-espresso)' }}
      >
        {title}
      </h2>
      <div
        className="w-px self-stretch hidden md:block"
        style={{ backgroundColor: 'var(--color-mansio-gold)' }}
      />
      <p className="text-base leading-relaxed" style={{ color: 'var(--color-mansio-mocha)' }}>
        {text}
      </p>
      <div>
        <Button to={buttonTo}>{buttonLabel}</Button>
      </div>
    </div>
  )

  const imageCol = (
    <div className="w-full h-80 md:h-full min-h-[400px]">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
  )

  return (
    <Container className="py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {imageRight ? (
          <>
            {textCol}
            {imageCol}
          </>
        ) : (
          <>
            {imageCol}
            {textCol}
          </>
        )}
      </div>
    </Container>
  )
}
