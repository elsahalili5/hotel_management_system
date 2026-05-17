import { apiClient } from '#/api/client'
import type { ReviewResponse, CreateReviewInput } from '@mansio/shared'

export const reviewApi = {
  getAll: () => apiClient.get<ReviewResponse[]>('/reviews'),
  create: (data: CreateReviewInput) =>
    apiClient.post<ReviewResponse, CreateReviewInput>('/reviews', data),
  approve: ({ id, is_approved }: { id: number; is_approved: boolean }) =>
    apiClient.patch<ReviewResponse, { is_approved: boolean }>(
      `/reviews/${id}/approve`,
      { is_approved },
    ),
  remove: (id: number) => apiClient.delete<void>(`/reviews/${id}`),
}
