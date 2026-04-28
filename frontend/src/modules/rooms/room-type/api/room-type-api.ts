import { apiClient } from '#/api/client'
import type {
  RoomTypeResponse,
  CreateRoomTypeInput,
  UpdateRoomTypeInput,
} from '@mansio/shared'

export const roomTypeApi = {
  getAll: () => apiClient.get<RoomTypeResponse[]>('/room-types'),
  getById: (id: number) => apiClient.get<RoomTypeResponse>(`/room-types/${id}`),
  create: (data: CreateRoomTypeInput) =>
    apiClient.post<RoomTypeResponse, CreateRoomTypeInput>('/room-types', data),
  update: ({ id, data }: { id: number; data: UpdateRoomTypeInput }) =>
    apiClient.patch<RoomTypeResponse, UpdateRoomTypeInput>(
      `/room-types/${id}`,
      data,
    ),
  delete: (id: number) => apiClient.delete<void>(`/room-types/${id}`),
}
