import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '../components/HeroSection'
import { TextSection } from '../components/TextSection'
import { SplitSection } from '../components/SplitSection'
import { useState } from 'react'
import { AccordionItem } from '../components/AccordionItem'
import { CallToAction } from '../components/CallToAction'
import { ArrowRight } from 'lucide-react'

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
    question: 'Do guests have access to the Spa and gym?',
    answer:
      'All our guests enjoy unlimited access to the Spa & Sports area, which includes the heated indoor pool, saunas, and our state-of-the-art fitness center.',
  },
  {
    question: 'Is parking available?',
    answer:
      'Yes. Mansio offers private parking for all guests.',
  },
  {
    question: 'Is Wi-Fi available throughout the hotel?',
    answer:
      'Yes. Complimentary high-speed Wi-Fi is available in all rooms and common areas throughout Mansio.',
  },
]

export const Route = createFileRoute('/')({ component: App })

function App() {
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
         buttonEndIcon={<ArrowRight size={20}/>}
      />

      <SplitSection
        title="Taste & Indulge"
        text="At Mansio, dining is an experience in itself. Our restaurant brings together refined flavors and carefully curated ingredients — each dish crafted to complement the elegance of your stay. From an intimate dinner to a quiet morning coffee, every moment at our table is one to remember."
        image="https://www.epidamn.com/assets/images/glass.jpg"
        buttonLabel="Our Restaurants"
        buttonTo="/restaurant"
        imageRight={false}
         buttonEndIcon={<ArrowRight size={20}/>}
      />

      <TextSection
        subtitle="Wellness, Redefined"
        paragraphs={[
          'At Mansio, we believe true luxury begins with how you feel. Start your morning with a revitalizing workout, unwind with a soothing massage at our spa, or simply relax in the serene atmosphere of our wellness facilities. Every experience has been thoughtfully designed to restore your body and calm your mind — because at Mansio, your wellbeing is our priority.',
        ]}
        buttonLabel="Explore Wellness"
        buttonTo="/spa"
        buttonEndIcon={<ArrowRight size={20}/>}
      />

      <CallToAction
              kicker="Reserve Your Stay"
              title="Ready to Experience Mansio?"
              description="Our team is here to ensure every detail of your stay exceeds your expectations."
              buttonLabel="Book Now"
              buttonTo="/rooms"
            />
      <div className="w-full px-4 md:px-10 py-16 md:py-32">
        <h2 className="font-serif md:text-5xl mb-10 text-4xl text-center text-mansio-espresso">
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
