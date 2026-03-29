import { Button } from './Button'

interface TextSectionProps {
  subtitle?: string
  paragraphs: string[]
  themeColor?: string
  buttonLabel?: string
  buttonTo?: string
}

export function TextSection({
  subtitle,
  paragraphs,
  themeColor = 'text-mansio-espresso',
  buttonLabel,
  buttonTo,
}: TextSectionProps) {
  return (
    <section className=" bg-mansio-cream py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {subtitle && (
          <h2
            className={`font-serif text-4xl md:text-5xl mb-10  font-medium ${themeColor}`}
          >
            {subtitle}
          </h2>
        )}
        <div className="space-y-6 text-mansio-mocha font-light leading-relaxed text-lg md:text-xl">
          {paragraphs.map((p, index) => (
            <p key={index}>{p}</p>
          ))}
        </div>
        {buttonLabel && buttonTo && (
          <div className="mt-10 flex justify-center">
            <Button to={buttonTo} variant="outline">
              {buttonLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
