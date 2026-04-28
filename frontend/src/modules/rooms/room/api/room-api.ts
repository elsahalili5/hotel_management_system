import { apiClient } from '#/api/client'
import type {
  RoomResponse,
  CreateRoomInput,
  UpdateRoomInput,
  UpdateRoomStatusInput,
} from '@mansio/shared'

export const roomApi = {
  getAll: () => apiClient.get<RoomResponse[]>('/rooms'),
  getById: (id: number) => apiClient.get<RoomResponse>(`/rooms/${id}`),
  create: (data: CreateRoomInput) =>
    apiClient.post<RoomResponse, CreateRoomInput>('/rooms', data),
  update: ({ id, data }: { id: number; data: UpdateRoomInput }) =>
    apiClient.patch<RoomResponse, UpdateRoomInput>(`/rooms/${id}`, data),
  updateStatus: ({ id, data }: { id: number; data: UpdateRoomStatusInput }) =>
    apiClient.patch<RoomResponse, UpdateRoomStatusInput>(
      `/rooms/${id}/status`,
      data,
    ),
  delete: (id: number) => apiClient.delete<void>(`/rooms/${id}`),
  getStats: () => apiClient.get<Record<string, number>>('/rooms/stats'),
}
