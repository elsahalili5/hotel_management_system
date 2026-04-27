import { authApi } from '../api/auth-api'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../auth-context'

export function useRegister() {
  const auth = useAuth()
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async (_, variables) => {
      await auth.login({ email: variables.email, password: variables.password })
    },
  })

  return registerMutation
}
