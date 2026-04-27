import { useQuery } from '@tanstack/react-query'
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