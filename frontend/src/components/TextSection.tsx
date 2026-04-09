import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from './Button'

interface TextSectionProps {
  subtitle?: string
  paragraphs: string[]
  themeColor?: string
  buttonLabel?: string
  buttonTo?: string
  buttonStartIcon?: ReactNode
  buttonEndIcon?: ReactNode
}

export function TextSection({
  subtitle,
  paragraphs,
  themeColor = 'text-mansio-espresso',
  buttonLabel,
  buttonTo,
  buttonStartIcon,
  buttonEndIcon,
}: TextSectionProps) {
  return (
    <section className="bg-mansio-cream py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-3xl md:max-w-4xl mx-auto text-center">
        {subtitle && (
          <h2
            className={`font-serif text-2xl sm:text-3xl md:text-5xl mb-6 sm:mb-8 md:mb-10 font-medium ${themeColor}`}
          >
            {subtitle}
          </h2>
        )}

        <div className="space-y-4 sm:space-y-6 text-mansio-mocha font-light leading-relaxed text-base sm:text-lg md:text-xl">
          {paragraphs.map((p, index) => (
            <p key={index}>{p}</p>
          ))}
        </div>

        {buttonLabel && buttonTo && (
          <div className="mt-6 sm:mt-8 md:mt-10 flex justify-center">
            <Link to={buttonTo} className="no-underline w-full sm:w-auto">
              <Button
                variant="outline"
                startIcon={buttonStartIcon}
                endIcon={buttonEndIcon}
                className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
              >
                {buttonLabel}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
