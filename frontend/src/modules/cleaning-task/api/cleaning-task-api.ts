import { apiClient } from '#/api/client'
import type {
  CleaningTaskResponse,
  CreateCleaningTaskInput,
  UpdateCleaningTaskStatusInput,
} from '@mansio/shared'

export const cleaningTaskApi = {
  getAll: () =>
    apiClient.get<CleaningTaskResponse[]>('/cleaning-tasks'),
  getMyTasks: () =>
    apiClient.get<CleaningTaskResponse[]>('/cleaning-tasks/my-tasks'),
  create: (data: CreateCleaningTaskInput) =>
    apiClient.post<CleaningTaskResponse, CreateCleaningTaskInput>(
      '/cleaning-tasks',
      data,
    ),
  updateStatus: ({
    id,
    data,
  }: {
    id: number
    data: UpdateCleaningTaskStatusInput
  }) =>
    apiClient.patch<CleaningTaskResponse, UpdateCleaningTaskStatusInput>(
      `/cleaning-tasks/${id}/status`,
      data,
    ),
  delete: (id: number) => apiClient.delete<void>(`/cleaning-tasks/${id}`),
}
