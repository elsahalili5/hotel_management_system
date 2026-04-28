import { apiClient } from '#/api/client'
import type {
  UserResponse,
  CreateGuestInput,
  CreateStaffInput,
  UpdateUserInput,
} from '@mansio/shared'

export const userApi = {
  getAll: () => apiClient.get<UserResponse[]>('/users'),
  getById: (id: number) => apiClient.get<UserResponse>(`/users/${id}`),
  createGuest: (data: CreateGuestInput) =>
    apiClient.post<UserResponse, CreateGuestInput>('/users/create-guest', data),
  createStaff: (data: CreateStaffInput) =>
    apiClient.post<UserResponse, CreateStaffInput>('/users/create-staff', data),
  update: ({ id, data }: { id: number; data: UpdateUserInput }) =>
    apiClient.put<UserResponse, UpdateUserInput>(`/users/${id}`, data),
  delete: (id: number) => apiClient.delete<void>(`/users/${id}`),
}
