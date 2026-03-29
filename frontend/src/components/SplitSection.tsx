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
  buttonLabel, // Hiqe = '' që të jetë undefined nëse nuk jepet
  buttonTo = '/about',
  imageRight = true,
}: SplitSectionProps) {
  const textCol = (
    <div className="flex flex-col justify-center gap-6">
      <h2 className="text-4xl md:text-5xl font-normal font-serif leading-tight text-mansio-espresso">
        {title}
      </h2>

      {/* Vija dekorative */}
      <div
        className="h-px w-20 md:block bg-mansio-gold" // E bëra horizontale si në foto që dërgove
      />

      <p
        className="text-base leading-relaxed"
        style={{ color: 'var(--color-mansio-mocha)' }}
      >
        {text}
      </p>

      {/* BUTONI OPSIONAL: Shfaqet vetëm nëse buttonLabel ekziston */}
      {buttonLabel && (
        <div>
          <Button to={buttonTo}>{buttonLabel}</Button>
        </div>
      )}
    </div>
  )

  // ... rest of the code (imageCol and return)

  const imageCol = (
    <div className="w-full h-80 md:h-full min-h-[400px]">
      <img src={image} alt={title} className="w-full h-full object-cover" />
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
