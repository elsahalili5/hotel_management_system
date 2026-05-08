import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '#/components/HeroSection'
import { TextSection } from '#/components/TextSection'
import { SplitSection } from '#/components/SplitSection'
import { DynamicImage } from '#/components/DynamicImage'

export const Route = createFileRoute('/(app)/restaurant')({
  component: Restaurant,
})

function Restaurant() {
  const foodDescription = [
    'At Mansio, culinary excellence meets the spirit of the Mediterranean. Our chefs combine exquisite ingredients with masterful creativity to craft flavors that linger.',
    'With a passion for superb food and an eclectic ambiance, every meal at our restaurant is a journey of discovery—a true love-at-first-bite experience.',
  ]
  const restaurantText =
    "Restaurant & Lounge, nestled in the heart of Mansio, offers a transformative experience where art and gastronomy meet. The lounge creates an ambiance of divine elegance, offering guests a curated selection of spirits and wines. On the opposite side, the restaurant emerges as a botanical haven where our Executive Chef's Mediterranean creations turn dining into an adventure."
  const beachBarText =
    ' Lulù by Mansio is our exclusive beach bar oasis where golden sands meet the horizon. A sculptural masterpiece of organic curves and woven textures, it is designed to embrace the coast and whisper timeless tales of the sea.'

  const allInclusiveDescription =
    'Savor the essence of local cuisine at our All-Inclusive restaurant, perched on the first floor with sweeping sea views. From a daily reinvented buffet featuring live cooking to our poolside bar serving classic cocktails and genuine spirits, we offer the pinnacle of leisure. Experience a place where every flavor tells a story and every sip is a toast to relaxation.'
  return (
    <main>
      <HeroSection
        height="500px"
        title="EAT & DRINK"
        image="https://epidamn.com/assets/images/food.jpg"
      />
      <TextSection subtitle="Food & Drinks" paragraphs={foodDescription} />
      <SplitSection
        title="Restaurant & Lounge"
        text={restaurantText}
        image="https://epidamn.com/assets/images/restoranti.jpg"
        imageRight={true}
      />{' '}
      <SplitSection
        title="Lulù Beach & Restaurant"
        text={beachBarText}
        image="https://www.swissotel.com/assets/0/92/2119/7910/7953/7955/6442454250/905b3dff-3380-4c9b-add6-ead791692d4b.jpg"
        imageRight={false}
      />
      <SplitSection
        title="All-Inclusive Restaurant & Bar"
        text={allInclusiveDescription}
        image="https://epidamn.com/assets/images/inside.jpg"
        imageRight={true}
      />
      <section className="mb-25">
        <DynamicImage
          src="https://epidamn.com/assets/images/glass.jpg"
          containerClassName="rounded-sm shadow-xl"
        />
      </section>
      <div className="flex justify-center pb-20">
        <div className="h-px w-32 bg-mansio-gold] opacity-50" />
      </div>
    </main>
  )
}
