import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

interface CallToActionProps {
  kicker: string
  title: string
  description: string
  buttonLabel: string
  buttonTo: string
}

export function CallToAction({ kicker, title, description, buttonLabel, buttonTo }: CallToActionProps) {
  return (
    <section className="py-24 px-4 text-center bg-mansio-espresso">
      <p className="text-xs tracking-widest uppercase mb-4 text-mansio-gold">{kicker}</p>
      <h2 className="font-serif text-4xl md:text-5xl mb-6 text-mansio-cream">{title}</h2>
      <p className="text-base max-w-lg mx-auto mb-10 font-light leading-relaxed text-mansio-linen">
        {description}
      </p>
      <Link to={buttonTo} className="no-underline">
        <button className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-medium tracking-widest uppercase rounded-full transition-opacity duration-200 hover:opacity-80 bg-mansio-gold text-mansio-espresso">
          {buttonLabel}
          <ArrowRight size={14} />
        </button>
      </Link>
    </section>
  )
}
