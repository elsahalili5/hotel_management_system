import { apiClient } from '#/api/client'
import type { StaffResponse, UpdateStaffInput } from '@mansio/shared'

export const staffApi = {
  getAll: () => apiClient.get<StaffResponse[]>('/staff'),
  getById: (id: number) => apiClient.get<StaffResponse>(`/staff/${id}`),
  update: ({ id, data }: { id: number; data: UpdateStaffInput }) =>
    apiClient.put<StaffResponse, UpdateStaffInput>(`/staff/${id}`, data),
  deleteUser: (userId: number) => apiClient.delete<void>(`/users/${userId}`),
}
