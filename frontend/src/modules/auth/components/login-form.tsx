import { useForm } from 'react-hook-form'
import { useLogin } from '../hooks/use-login'
import type { LoginUserInput } from '@mansio/shared/auth'
import { useNavigate } from '@tanstack/react-router'

export function LoginForm() {
  const navigate = useNavigate();
  const loginMutation = useLogin()
  const loginForm = useForm<LoginUserInput>();

  const handleSubmit = loginForm.handleSubmit(async (values) => {
    await loginMutation.mutateAsync(values);
    navigate({ to: '/dashboard', replace: true });
  })

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" {...loginForm.register('email')} />
      <input type="password" placeholder="Password" {...loginForm.register('password')} />
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>  
    </form>
  )
}


//   <FormSection
  //       title="Welcome Back"
  //       subtitle="Sign in to manage your reservations and preferences."
  //       submitLabel="Sign In"
  //       submitIcon={<LogIn size={14} strokeWidth={1.5} />}
  //       successTitle="Signed In"
  //       successMessage="You have successfully signed in to your Mansio account."
  //       background="cream"
  //       card
  //       onSubmit={async (values) => {
  //         loginMutation.mutate(values as LoginUserInput)
  //       }}
  //       fields={[
  //         {
  //           name: 'email',
  //           label: 'Email Address',
  //           type: 'email',
  //           placeholder: 'jane@example.com',
  //           required: true,
  //           colSpan: 'full',
  //         },
  //         {
  //           name: 'password',
  //           label: 'Password',
  //           type: 'text',
  //           placeholder: '••••••••',
  //           required: true,
  //           colSpan: 'full',
  //         },
  //       ]}
  //       footer={
  //         <p className="text-center text-xs text-mansio-taupe mt-4">
  //           Don't have an account?{' '}
  //           <Link
  //             to="/signup"
  //             className="text-mansio-mocha underline underline-offset-4 hover:text-mansio-espresso transition-colors"
  //           >
  //             Sign up
  //           </Link>
  //         </p>
  //       }
  //     />