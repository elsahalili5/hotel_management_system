import { createFileRoute, Outlet, useChildMatches } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { HeroSection } from '#/components/HeroSection'
import { TextSection } from '#/components/TextSection'
import { SplitSection } from '#/components/SplitSection'

export const Route = createFileRoute('/(app)/rooms')({
  component: Rooms,
})

function Rooms() {
  const childMatches = useChildMatches()

  if (childMatches.length > 0) {
    return <Outlet />
  }

  return (
    <main className="min-h-screen">
      <HeroSection
        height="500px"
        title="ROOMS"
        subtitle="Your Home Away From Home"
        image="https://epidamn.com/assets/images/pamjedhoma.jpg"
      />

      <TextSection
        subtitle="Comfort Redefined"
        paragraphs={[
          'At Mansio, every room is a sanctuary — a carefully composed space where warmth, elegance, and ease come together. Whether you are here for a night or a week, you will find everything you need to feel completely at home.',
          'From our thoughtfully designed Standard Rooms to our expansive Suites, each space has been curated with the finest materials and attention to detail, ensuring a restful and refined experience for every guest.',
        ]}
      />

      <SplitSection
        title="Luxury Suites"
        text="Our suites offer an unparalleled level of comfort and sophistication. Expansive living areas, panoramic views, and bespoke furnishings create an atmosphere of effortless luxury — ideal for those who seek the very best that Mansio has to offer."
        image="https://epidamn.com/assets/images/inside.png"
        buttonLabel="See More"
        buttonTo="/rooms/1"
        buttonEndIcon={<ArrowRight size={20} />}
        imageRight={false}
      />
    </main>
  )
}
