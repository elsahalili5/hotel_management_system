import { apiClient } from '#/api/client'
import type {
  LoginUserInput,
  LoginUserResponse,
  RegisterUserInput,
  RegisterUserResponse,
} from '@mansio/shared'

export const authApi = {
  login: (payload: LoginUserInput) =>
    apiClient.post<LoginUserResponse, LoginUserInput>('/auth/login', payload),
  register: (payload: RegisterUserInput) =>
    apiClient.post<RegisterUserResponse, RegisterUserInput>(
      '/auth/register',
      payload,
    ),
}
