import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roomTypeApi } from '../api/room-type-api'

export const roomTypeKeys = {
  all: ['room-types'] as const,
  detail: (id: number) => ['room-types', id] as const,
}

export function useRoomTypes() {
  return useQuery({
    queryKey: roomTypeKeys.all,
    queryFn: roomTypeApi.getAll,
  })
}

export function useRoomTypeById(id: number) {
  return useQuery({
    queryKey: roomTypeKeys.detail(id),
    queryFn: () => roomTypeApi.getById(id),
  })
}

export function useCreateRoomType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: roomTypeApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomTypeKeys.all })
    },
  })
}

export function useUpdateRoomType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: roomTypeApi.update,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: roomTypeKeys.all })
      queryClient.invalidateQueries({ queryKey: roomTypeKeys.detail(id) })
    },
  })
}

export function useDeleteRoomType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: roomTypeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomTypeKeys.all })
    },
  })
}
