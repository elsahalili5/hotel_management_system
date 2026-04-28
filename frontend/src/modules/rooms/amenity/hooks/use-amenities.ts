import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { amenityApi } from '../api/amenity-api'

export const amenityKeys = {
  all: ['amenities'] as const,
  detail: (id: number) => ['amenities', id] as const,
}

export function useAmenities() {
  return useQuery({
    queryKey: amenityKeys.all,
    queryFn: amenityApi.getAll,
  })
}

export function useCreateAmenity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: amenityApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: amenityKeys.all })
    },
  })
}

export function useUpdateAmenity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: amenityApi.update,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: amenityKeys.all })
      queryClient.invalidateQueries({ queryKey: amenityKeys.detail(id) })
    },
  })
}

export function useDeleteAmenity() {
  const queryClient = useQueryClient()
  return useMutation({
   
    mutationFn: (id: number) => amenityApi.delete(id), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: amenityKeys.all })
    },
  })
}
