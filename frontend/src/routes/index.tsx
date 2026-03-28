import Header from '#/components/Header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main>
      <Header />
      <h1 className="text-center">Hello World</h1>
    </main>
  )
}
