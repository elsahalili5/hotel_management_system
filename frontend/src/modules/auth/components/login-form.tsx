import { useForm } from 'react-hook-form'
import { useLogin } from '../hooks/use-login'
import type { LoginUserInput } from '@mansio/shared/auth'
import { useNavigate, Link } from '@tanstack/react-router'
import { LogIn } from 'lucide-react'

const inputClass =
  'w-full bg-white border border-mansio-linen/60 rounded-sm px-4 py-3 text-sm text-mansio-espresso placeholder-mansio-linen focus:outline-none focus:border-mansio-gold transition-colors'
const labelClass =
  'text-xs font-medium tracking-widest uppercase text-mansio-taupe mb-1.5 block'

export function LoginForm() {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const loginForm = useForm<LoginUserInput>()

  const handleSubmit = loginForm.handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values)
      navigate({ to: '/', replace: true })
    } catch (error) {
      console.error('Login failed', error)
    }
  })

  return (
    <section className="bg-mansio-cream min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white border border-mansio-linen/50 rounded-xl shadow-sm shadow-mansio-linen/40 px-8 py-10">
        <div className="text-center mb-8">
          <h2 className="font-serif font-normal text-mansio-espresso leading-tight mb-4 text-3xl md:text-4xl">
            Welcome
          </h2>
          <div className="h-px w-12 bg-mansio-gold mx-auto mb-4" />
          <p className="text-mansio-mocha text-sm leading-relaxed">
            Sign in to manage your reservations and preferences.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                placeholder="jane@example.com"
                className={inputClass}
                {...loginForm.register('email', { required: true })}
              />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className={inputClass}
                {...loginForm.register('password', { required: true })}
              />
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-mansio-linen/40 flex justify-center">
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="bg-mansio-espresso text-white px-8 py-3 rounded-sm text-xs font-medium tracking-widest uppercase hover:bg-mansio-mocha transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loginMutation.isPending ? (
                <>
                  <SpinnerIcon />
                  Logging in...
                </>
              ) : (
                <>
                  Sign In
                  <LogIn size={14} strokeWidth={1.5} />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-mansio-taupe mt-6">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-mansio-mocha underline underline-offset-4 hover:text-mansio-espresso transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  )
}

function SpinnerIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
