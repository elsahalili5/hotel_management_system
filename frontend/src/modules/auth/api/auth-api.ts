import { apiClient } from '#/api/client'
import type { LoginUserInput, LoginUserResponse, RegisterUserInput, AuthUser } from '@mansio/shared'

export const authApi = {
  login: (payload: LoginUserInput) =>
    apiClient.post<LoginUserResponse, LoginUserInput>('/auth/login', payload),
  register: (payload: RegisterUserInput) =>
    apiClient.post<AuthUser, RegisterUserInput>('/auth/register', payload),
}
