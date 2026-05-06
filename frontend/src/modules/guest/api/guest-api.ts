import { apiClient } from '#/api/client'
import type { GuestResponse, UpdateGuestInput } from '@mansio/shared'

export const guestApi = {
  getAll: () => apiClient.get<GuestResponse[]>('/guests'),
  getById: (id: number) => apiClient.get<GuestResponse>(`/guests/${id}`),
  update: ({ id, data }: { id: number; data: UpdateGuestInput }) =>
    apiClient.put<GuestResponse, UpdateGuestInput>(`/guests/${id}`, data),
  deleteUser: (userId: number) => apiClient.delete<void>(`/users/${userId}`),
}
