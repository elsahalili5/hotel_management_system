import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '../components/HeroSection'
import { TextSection } from '../components/TextSection'
import { SplitSection } from '../components/SplitSection'
import { useState } from 'react'
import { AccordionItem } from '../components/AccordionItem' // Importo komponentin tënd të ri

const faqs = [
  {
    question: 'Do you offer breakfast?',
    answer:
      'Yes. Mansio offers a daily breakfast experience featuring freshly prepared dishes, seasonal ingredients, and a selection of fine teas and coffees — served each morning in our dining room.',
  },
  {
    question: 'What are the check-in and check-out times?',
    answer:
      'Check-in begins at 3:00 PM and check-out is until 11:00 AM. Early check-in and late check-out may be arranged upon request, subject to availability.',
  },
  {
    question: 'Can I modify or cancel my reservation?',
    answer:
      'Yes. Reservations may be modified or cancelled up to 48 hours before your arrival date at no charge. Cancellations made within 48 hours may be subject to a one-night fee.',
  },
  {
    question: 'Is parking available?',
    answer:
      'Yes. Mansio offers private parking for all guests. Please inform us upon booking if you require a parking space.',
  },
  {
    question: 'Is Wi-Fi available throughout the hotel?',
    answer:
      'Yes. Complimentary high-speed Wi-Fi is available in all rooms and common areas throughout Mansio.',
  },
]

export const Route = createFileRoute('/')({ component: App })

function App() {
  // Logjika për të mbajtur vetëm një FAQ të hapur
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <main className="min-h-screen">
      <HeroSection
        image="https://epidamn.com/assets/images/recp.jpg"
        title="Welcome to Mansio"
        subtitle="Where Every Stay Feels Like Home"
      />

      <TextSection
        subtitle="Born from a Vision, Built for You"
        paragraphs={[
          'Mansio was not built to impress — it was built to welcome. Every corner, every detail, every moment of your stay has been crafted with one purpose in mind: to make you feel at ease. In the heart of Pristina, we created a space where elegance meets simplicity, and where every guest leaves with a reason to return.',
        ]}
      />

      <SplitSection
        title="A Place to Call Your Own"
        text="Mansio is more than a hotel — it is a retreat crafted for those who seek stillness without sacrificing elegance. Every detail has been thoughtfully considered, so you can simply arrive and feel at home."
        image="https://confident-health-b88439dafa.media.strapiapp.com/medium_spaa_ad561c7e11.jpg"
        buttonLabel="Discover More"
        buttonTo="/about"
      />

      <SplitSection
        title="Taste & Indulge"
        text="At Mansio, dining is an experience in itself. Our restaurant brings together refined flavors and carefully curated ingredients — each dish crafted to complement the elegance of your stay. From an intimate dinner to a quiet morning coffee, every moment at our table is one to remember."
        image="https://www.epidamn.com/assets/images/glass.jpg"
        buttonLabel="Our Restaurants"
        buttonTo="/restaurant"
        imageRight={false}
      />

      <TextSection
        subtitle="Wellness, Redefined"
        paragraphs={[
          'At Mansio, we believe true luxury begins with how you feel. Start your morning with a revitalizing workout, unwind with a soothing massage at our spa, or simply relax in the serene atmosphere of our wellness facilities. Every experience has been thoughtfully designed to restore your body and calm your mind — because at Mansio, your wellbeing is our priority.',
        ]}
        buttonLabel="Explore Wellness"
        buttonTo="/spa"
      />

      {/* SEKSIONI FAQ DUKE PËRDORUR ACCORDIONITEM */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-16 text-mansio-espresso">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-4 ">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              title={faq.question}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <p className="text-mansio-mocha leading-relaxed">{faq.answer}</p>
            </AccordionItem>
          ))}
        </div>
      </div>
    </main>
  )
}
