import { createFileRoute, Link } from '@tanstack/react-router'
import { FormSection } from '../components/Form'
import { UserPlus } from 'lucide-react'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  return (
    <main>
      <FormSection
        title="Create Account"
        subtitle="Join Mansio and manage your reservations with ease."
        submitLabel="Sign Up"
        submitIcon={<UserPlus size={14} strokeWidth={1.5} />}
        successTitle="Account Created"
        successMessage="Welcome to Mansio. You can now sign in to your account."
        background="cream"
        card
        onSubmit={async (values) => {
          // TODO: wire up to POST /api/auth/register
          console.log('register', values)
        }}
        fields={[
          {
            name: 'first_name',
            label: 'First Name',
            type: 'text',
            placeholder: 'Jane',
            required: true,
          },
          {
            name: 'last_name',
            label: 'Last Name',
            type: 'text',
            placeholder: 'Doe',
            required: true,
          },
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
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-mansio-mocha underline underline-offset-4 hover:text-mansio-espresso transition-colors"
            >
              Sign in
            </Link>
          </p>
        }
      />
    </main>
  )
}
