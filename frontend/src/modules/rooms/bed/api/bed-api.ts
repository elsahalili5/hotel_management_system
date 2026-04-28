import { apiClient } from '#/api/client'
import type {
  BedResponse,
  CreateBedInput,
  UpdateBedInput,
} from '@mansio/shared'

export const bedApi = {
  getAll: () => apiClient.get<BedResponse[]>('/beds'),
  getById: (id: number) => apiClient.get<BedResponse>(`/beds/${id}`),
  create: (data: CreateBedInput) =>
    apiClient.post<BedResponse, CreateBedInput>('/beds', data),
  update: ({ id, data }: { id: number; data: UpdateBedInput }) =>
    apiClient.patch<BedResponse, UpdateBedInput>(`/beds/${id}`, data),
  delete: (id: number) => apiClient.delete<void>(`/beds/${id}`),
}
