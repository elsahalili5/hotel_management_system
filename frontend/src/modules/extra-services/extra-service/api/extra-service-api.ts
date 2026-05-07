import { apiClient } from '#/api/client'
import type {
  ExtraServiceResponse,
  CreateExtraServiceInput,
  UpdateExtraServiceInput,
} from '@mansio/shared'

export const extraServiceApi = {
  getAll: () => apiClient.get<ExtraServiceResponse[]>('/extra-services'),
  getById: (id: number) => apiClient.get<ExtraServiceResponse>(`/extra-services/${id}`),
  create: (data: CreateExtraServiceInput) =>
    apiClient.post<ExtraServiceResponse, CreateExtraServiceInput>('/extra-services', data),
  update: ({ id, data }: { id: number; data: UpdateExtraServiceInput }) =>
    apiClient.put<ExtraServiceResponse, UpdateExtraServiceInput>(`/extra-services/${id}`, data),
  delete: (id: number) => apiClient.delete<void>(`/extra-services/${id}`),
}
