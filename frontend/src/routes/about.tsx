import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '../components/HeroSection'
import { TextSection } from '../components/TextSection'
import { DynamicImage } from '../components/DynamicImage' // Importo komponentin gjenerik

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  const aboutText = [
    "Rooted in the Latin meaning of 'home' and 'sanctuary,' Mansio is more than a destination—it is a place to remain. We have created a space where history breathes and every guest finds a sense of belonging.",
    'Our philosophy celebrates the art of staying. By blending timeless architecture with the warmth of a private residence, we ensure that every moment spent here feels like a return to elegance and comfort.',
  ]

  const mansioExperience = [
    "Our essence is defined by tranquility—a serene 'white sensation' that transcends the ordinary. Every detail of the Mansio is meticulously crafted, weaving together motifs of the sea, the soft touch of sand, and organic botanical elements to evoke the true soul of coastal living.",
    'At the heart of this sanctuary is our dedicated team—a group defined by passion and precision. Together, we are committed to ensuring that every guest experience at Mansio surpasses expectations, turning a simple stay into a lasting memory of home.',
  ]

  return (
    <main className="bg-[#fdf8f3]">
      <HeroSection
        title="About Us"
        image="https://epidamn.com/assets/images/epidamnjashte.jpg"
      />

      {/* Seksioni i parë */}
      <TextSection subtitle="The Essence of Home" paragraphs={aboutText} />

      {/* Imazhi vizual midis teksteve (Shtuar këtu) */}
      <DynamicImage
        src="https://epidamn.com/assets/images/inside.png" // Zëvendësoje me një foto të brendshme (lobby/spa)
        alt="Mansio Interior Experience"
        height="600px"
        containerClassName="rounded-sm shadow-xl"
      />

      {/* Seksioni i dytë */}
      <TextSection
        subtitle="Feel The White Sensation"
        paragraphs={mansioExperience}
      />

      {/* Opsionale: Një imazh tjetër në fund për ta mbyllur faqen me stil */}
    </main>
  )
}
