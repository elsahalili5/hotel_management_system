import { apiClient } from '#/api/client'
import type {
  ServiceCategoryResponse,
  CreateServiceCategoryInput,
  UpdateServiceCategoryInput,
} from '@mansio/shared'

export const serviceCategoryApi = {
  getAll: () => apiClient.get<ServiceCategoryResponse[]>('/service-categories'),
  getById: (id: number) => apiClient.get<ServiceCategoryResponse>(`/service-categories/${id}`),
  create: (data: CreateServiceCategoryInput) =>
    apiClient.post<ServiceCategoryResponse, CreateServiceCategoryInput>('/service-categories', data),
  update: ({ id, data }: { id: number; data: UpdateServiceCategoryInput }) =>
    apiClient.patch<ServiceCategoryResponse, UpdateServiceCategoryInput>(`/service-categories/${id}`, data),
  delete: (id: number) => apiClient.delete<void>(`/service-categories/${id}`),
}