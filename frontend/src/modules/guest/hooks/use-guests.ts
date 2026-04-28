import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { guestApi } from '../api/guest-api'

export const guestKeys = {
  all: ['guests'] as const,
  detail: (id: number) => ['guests', id] as const,
}

export function useGuests() {
  return useQuery({
    queryKey: guestKeys.all,
    queryFn: guestApi.getAll,
  })
}

export function useGuest(id: number) {
  return useQuery({
    queryKey: guestKeys.detail(id),
    queryFn: () => guestApi.getById(id),
  })
}

export function useUpdateGuest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: guestApi.update,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: guestKeys.all })
      queryClient.invalidateQueries({ queryKey: guestKeys.detail(id) })
    },
  })
}
