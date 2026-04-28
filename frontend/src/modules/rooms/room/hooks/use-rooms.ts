import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roomApi } from '../api/room-api'

export const roomKeys = {
  all: ['rooms'] as const,
  detail: (id: number) => ['rooms', id] as const,
  stats: ['rooms', 'stats'] as const,
}

export function useRooms() {
  return useQuery({
    queryKey: roomKeys.all,
    queryFn: roomApi.getAll,
  })
}

export function useRoom(id: number) {
  return useQuery({
    queryKey: roomKeys.detail(id),
    queryFn: () => roomApi.getById(id),
  })
}

export function useCreateRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: roomApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.all })
    },
  })
}

export function useUpdateRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: roomApi.update,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.all })
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(id) })
    },
  })
}

export function useUpdateRoomStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: roomApi.updateStatus,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.all })
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(id) })
    },
  })
}

export function useRoomStats() {
  return useQuery({
    queryKey: roomKeys.stats,
    queryFn: roomApi.getStats,
  })
}

export function useDeleteRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => roomApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.all })
    },
  })
}
