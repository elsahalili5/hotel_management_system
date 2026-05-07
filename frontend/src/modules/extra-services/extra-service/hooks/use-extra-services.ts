import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { extraServiceApi } from '../api/extra-service-api'

export const extraServiceKeys = {
  all: ['extra-services'] as const,
  detail: (id: number) => ['extra-services', id] as const,
}

export function useExtraServices() {
  return useQuery({
    queryKey: extraServiceKeys.all,
    queryFn: extraServiceApi.getAll,
  })
}

export function useCreateExtraService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: extraServiceApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extraServiceKeys.all })
    },
  })
}

export function useUpdateExtraService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: extraServiceApi.update,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: extraServiceKeys.all })
      queryClient.invalidateQueries({ queryKey: extraServiceKeys.detail(id) })
    },
  })
}

export function useDeleteExtraService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => extraServiceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: extraServiceKeys.all })
    },
  })
}
