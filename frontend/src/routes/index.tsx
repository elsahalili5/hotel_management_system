import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '../components/HeroSection'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main>
      <HeroSection
        image="https://epidamn.com/assets/images/recp.jpg"
        title="Welcome to Mansio"
        subtitle="Where Every Stay Feels Like Home"
      />
    </main>
  )
}
