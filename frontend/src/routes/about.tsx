import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '../components/HeroSection'
import { TextSection } from '../components/TextSection'
import { DynamicImage } from '../components/DynamicImage'
import { useState } from 'react'
import { AccordionItem } from '../components/AccordionItem'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  const [openSection, setOpenSection] = useState<string | null>('rooms')

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const aboutText = [
    "Rooted in the Latin meaning of 'home' and 'sanctuary,' Mansio is more than a destination—it is a place to remain. We have created a space where history breathes and every guest finds a sense of belonging.",
    'Our philosophy celebrates the art of staying. By blending timeless architecture with the warmth of a private residence, we ensure that every moment spent here feels like a return to elegance and comfort.',
  ]

  const mansioExperience = [
    "Our essence is defined by tranquility—a serene 'white sensation' that transcends the ordinary. Every detail of the Mansio is meticulously crafted, weaving together motifs of the sea, the soft touch of sand, and organic botanical elements to evoke the true soul of coastal living.",
    'At the heart of this sanctuary is our dedicated team—a group defined by passion and precision. Together, we are committed to ensuring that every guest experience at Mansio surpasses expectations, turning a simple stay into a lasting memory of home.',
  ]

  const renderList = (items: string[], isGrid: boolean = false) => (
    <div
      className={`grid ${isGrid ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-x-12 gap-y-3`}
    >
      {items.map((item) => (
        <div key={item} className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-mansio-gold" />
          <span className="font-sans font-light text-sm tracking-wide uppercase md:normal-case">
            {item}
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <main className="bg-mansio-cream min-h-screen">
      <HeroSection
        height="500px"
        title="About Us"
        image="https://epidamn.com/assets/images/epidamnjashte.jpg"
      />

      <TextSection subtitle="The Essence of Home" paragraphs={aboutText} />

      <DynamicImage
        src="https://epidamn.com/assets/images/inside.png"
        alt="Mansio Interior Experience"
        containerClassName="rounded-sm shadow-xl "
      />

      <TextSection
        subtitle="Feel The White Sensation"
        paragraphs={mansioExperience}
      />

      <section className="max-w-8xl mx-auto px-6 py-20">
        <h2 className="text-center font-serif text-4xl mb-12  text-mansio-espresso">
          What to expect
        </h2>

        <div className="flex flex-col gap-4">
          <AccordionItem
            title="Rooms"
            isOpen={openSection === 'rooms'}
            onClick={() => toggleSection('rooms')}
          >
            {renderList(
              [
                '42 Standard Rooms',
                'Free Wifi',
                '54 Family Rooms',
                'Minibar',
                '12 Business Rooms',
                '42 inch TV',
                '12 Deluxe Rooms',
                'In-room coffee machine',
                '5 Suite',
                'Work desk',
                'Room with non-smoking alarm system',
                'Safe',
                'Organic Bathroom Amenities',
                'Baby cot on request',
                'Hairdryer',
                'ADA Rooms available',
              ],
              true,
            )}
          </AccordionItem>

          <AccordionItem
            title="Eat & Drink"
            isOpen={openSection === 'eat-drink'}
            onClick={() => toggleSection('eat-drink')}
          >
            {renderList([
              ' Restaurant & lounge',
              'Lulù beach & restaurant',
              'All-Inclusive Restaurant & Bar',
            ])}
          </AccordionItem>

          <AccordionItem
            title="Services"
            isOpen={openSection === 'services'}
            onClick={() => toggleSection('services')}
          >
            {renderList(
              [
                '24/7 Front Desk',
                'Valet parking',
                'In-room Dining',
                'Parking',
                'Housekeeping service',
                'Cars for rent',
                'Laundry & dry cleaning by request',
                'Tourist information: on reception',
                'Airport shuttle by request',
                'Postal service: available at reception',
                'Awakening service',
              ],
              true,
            )}
          </AccordionItem>

          <AccordionItem
            title="Wellness & Spa"
            isOpen={openSection === 'spa'}
            onClick={() => toggleSection('spa')}
          >
            {renderList([
              'INTERLUDE SPA',
              'COLD PLUNGE',
              'GYM & FITNESS',
              'YOGA',
              'OUTDOOR ACTIVITIES',
              'BEAUTY SALON',
            ])}
          </AccordionItem>
        </div>
      </section>
    </main>
  )
}
