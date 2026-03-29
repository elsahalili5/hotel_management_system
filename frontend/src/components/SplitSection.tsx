import { Link } from '@tanstack/react-router'
import { Button } from './Button'
import { Container } from './Container'

import type { ReactNode } from 'react'

interface SplitSectionProps {
  title: string
  text: string
  image: string
  buttonLabel?: string
  buttonTo?: string
  buttonStartIcon?: ReactNode
  buttonEndIcon?: ReactNode
  imageRight?: boolean
}
export function SplitSection({
  title,
  text,
  image,
  buttonLabel,
  buttonTo,
  buttonStartIcon,
  buttonEndIcon,
  imageRight = true,
}: SplitSectionProps) {
  const textCol = (
    <div className="flex flex-col justify-center gap-6">
      <h2 className="text-4xl md:text-5xl font-normal font-serif leading-tight text-mansio-espresso">
        {title}
      </h2>

     
      <div
        className="h-px w-20 md:block bg-mansio-gold" 
      />

      <p
        className="text-base leading-relaxed"
        style={{ color: 'var(--color-mansio-mocha)' }}
      >
        {text}
      </p>

     
      {buttonLabel && buttonTo && (
        <div>
          <Link to={buttonTo} className="no-underline">
            <Button startIcon={buttonStartIcon} endIcon={buttonEndIcon}>{buttonLabel}</Button>
          </Link>
        </div>
      )}
    </div>
  )

 

  const imageCol = (
    <div className="w-full h-[300px] md:h-[500px]">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
  )

  return (
    <Container className="py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-stretch">
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
