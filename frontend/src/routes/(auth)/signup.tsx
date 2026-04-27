import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '#/modules/auth/components/signup-form'

export const Route = createFileRoute('/(auth)/signup')({
  component: SignupPage,
})

function SignupPage() {
  return (
    <main>
      <SignupForm />
    </main>
  )
}
