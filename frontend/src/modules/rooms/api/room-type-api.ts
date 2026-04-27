import { apiClient } from '#/api/client'
import type { RoomTypeResponse } from '@mansio/shared'

export const roomTypeApi = {
  getAll: () => apiClient.get<RoomTypeResponse[]>('/room-types'),
  getById: (id: number) => apiClient.get<RoomTypeResponse>(`/room-types/${id}`),
}