import { apiClient } from '#/api/client'
import type { MealPlanResponse, CreateMealPlanInput, UpdateMealPlanInput } from '@mansio/shared'

export const mealPlanApi = {
  getAll: () => apiClient.get<MealPlanResponse[]>('/meal-plans'),
  getById: (id: number) => apiClient.get<MealPlanResponse>(`/meal-plans/${id}`),
  create: (data: CreateMealPlanInput) =>
    apiClient.post<MealPlanResponse, CreateMealPlanInput>('/meal-plans', data),
  update: ({ id, data }: { id: number; data: UpdateMealPlanInput }) =>
    apiClient.put<MealPlanResponse, UpdateMealPlanInput>(`/meal-plans/${id}`, data),
  delete: (id: number) => apiClient.delete<void>(`/meal-plans/${id}`),
}
