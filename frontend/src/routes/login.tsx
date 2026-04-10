import { createFileRoute, Link } from '@tanstack/react-router'
import { FormSection } from '../components/Form'
import { LogIn } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <main>
      <FormSection
        title="Welcome Back"
        subtitle="Sign in to manage your reservations and preferences."
        submitLabel="Sign In"
        submitIcon={<LogIn size={14} strokeWidth={1.5} />}
        successTitle="Signed In"
        successMessage="You have successfully signed in to your Mansio account."
        background="cream"
        card
        onSubmit={async (values) => {
          // TODO: wire up to auth API
          console.log('login', values)
        }}
        fields={[
          {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            placeholder: 'jane@example.com',
            required: true,
            colSpan: 'full',
          },
          {
            name: 'password',
            label: 'Password',
            type: 'text',
            placeholder: '••••••••',
            required: true,
            colSpan: 'full',
          },
        ]}
        footer={
          <p className="text-center text-xs text-mansio-taupe mt-4">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-mansio-mocha underline underline-offset-4 hover:text-mansio-espresso transition-colors"
            >
              Sign up
            </Link>
          </p>
        }
      />
    </main>
  )
}
