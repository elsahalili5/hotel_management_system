import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mealPlanApi } from '../api/meal-plan.api'

export const mealPlanKeys = {
  all: ['meal-plans'] as const,
  detail: (id: number) => ['meal-plans', id] as const,
}

export function useMealPlans() {
  return useQuery({
    queryKey: mealPlanKeys.all,
    queryFn: mealPlanApi.getAll,
  })
}

export function useCreateMealPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: mealPlanApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.all })
    },
  })
}

export function useUpdateMealPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: mealPlanApi.update,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.all })
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.detail(id) })
    },
  })
}

export function useDeleteMealPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => mealPlanApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.all })
    },
  })
}
