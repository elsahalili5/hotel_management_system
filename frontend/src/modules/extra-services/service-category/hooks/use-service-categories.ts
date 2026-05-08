import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { serviceCategoryApi } from '../api/service-category-api'

export const serviceCategoryKeys = {
  all: ['service-categories'] as const,
  detail: (id: number) => ['service-categories', id] as const,
}

export function useServiceCategories() {
  return useQuery({
    queryKey: serviceCategoryKeys.all,
    queryFn: serviceCategoryApi.getAll,
  })
}

export function useCreateServiceCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: serviceCategoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceCategoryKeys.all })
    },
  })
}

export function useUpdateServiceCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: serviceCategoryApi.update,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: serviceCategoryKeys.all })
      queryClient.invalidateQueries({
        queryKey: serviceCategoryKeys.detail(id),
      })
    },
  })
}

export function useDeleteServiceCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => serviceCategoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceCategoryKeys.all })
    },
  })
}
