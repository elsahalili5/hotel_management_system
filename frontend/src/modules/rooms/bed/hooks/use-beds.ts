import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bedApi } from '../api/bed-api'

export const bedKeys = {
  all: ['beds'] as const,
  detail: (id: number) => ['beds', id] as const,
}

export function useBeds() {
  return useQuery({
    queryKey: bedKeys.all,
    queryFn: bedApi.getAll,
  })
}

export function useCreateBed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bedApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bedKeys.all })
    },
  })
}

export function useUpdateBed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bedApi.update,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bedKeys.all })
      queryClient.invalidateQueries({ queryKey: bedKeys.detail(id) })
    },
  })
}

export function useDeleteBed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bedApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bedKeys.all })
    },
  })
}
