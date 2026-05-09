import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AvailabilityQuery, CreateReservationInput } from '../api/reservation-api'
import { reservationApi } from '../api/reservation-api'

export const reservationKeys = {
  availability: (q: AvailabilityQuery) =>
    ['reservations', 'availability', q.room_type_id, q.check_in_date, q.check_out_date] as const,
}

export function useReservationAvailability(query: AvailabilityQuery | null, enabled: boolean) {
  return useQuery({
    queryKey: query
      ? reservationKeys.availability(query)
      : ['reservations', 'availability', 'idle'],
    queryFn: () => reservationApi.checkAvailability(query!),
    enabled:
      enabled &&
      !!query &&
      query.room_type_id > 0 &&
      Boolean(query.check_in_date) &&
      Boolean(query.check_out_date),
  })
}

export function useCreateReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReservationInput) => reservationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    },
  })
}
