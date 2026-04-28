import { apiClient } from '#/api/client'
import type {
  AmenityResponse,
  CreateAmenityInput,
  UpdateAmenityInput,
} from '@mansio/shared'

export const amenityApi = {
  getAll: () => apiClient.get<AmenityResponse[]>('/amenities'),
  getById: (id: number) => apiClient.get<AmenityResponse>(`/amenities/${id}`),
  create: (data: CreateAmenityInput) =>
    apiClient.post<AmenityResponse, CreateAmenityInput>('/amenities', data),
  update: ({ id, data }: { id: number; data: UpdateAmenityInput }) =>
    apiClient.patch<AmenityResponse, UpdateAmenityInput>(
      `/amenities/${id}`,
      data,
    ),
  delete: (id: number) => apiClient.delete<void>(`/amenities/${id}`),
}
