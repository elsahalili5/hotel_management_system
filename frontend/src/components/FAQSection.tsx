import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { Container } from './Container'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  title?: string
  items: FAQItem[]
}

export function FAQSection({ title = 'Frequently Asked Questions', items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-24 bg-mansio-ivory">
      <Container>
        <h2
          className="text-4xl md:text-5xl font-normal text-mansio-espresso mb-12 text-center"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {title}
        </h2>

        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {items.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className="rounded-4xl border border-mansio-gold px-6 overflow-hidden transition-all duration-300 ease-in-out"
                style={{ backgroundColor: 'var(--color-mansio-cream)' }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="text-base font-medium text-mansio-espresso" style={{ fontFamily: 'var(--font-serif)' }}>
                    {item.question}
                  </span>
                  <span className="flex-shrink-0 text-mansio-gold">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>

                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? '300px' : '0px' }}
                >
                  <p className="pb-5 text-sm leading-relaxed text-mansio-mocha">
                    {item.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
