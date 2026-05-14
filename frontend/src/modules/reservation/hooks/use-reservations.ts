import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  AvailabilityQuery,
  CreateReservationInput,
} from '../api/reservation-api'
import { reservationApi } from '../api/reservation-api'

export const reservationKeys = {
  all: ['reservations'] as const,
  today: ['reservations', 'today'] as const,
  my: ['reservations', 'my'] as const,
  availability: (q: AvailabilityQuery) =>
    ['reservations', 'availability', q.room_type_id, q.check_in_date, q.check_out_date] as const,
}

export function useReservations() {
  return useQuery({
    queryKey: reservationKeys.all,
    queryFn: reservationApi.getAll,
  })
}

export function useTodaysCheckIns() {
  return useQuery({
    queryKey: reservationKeys.today,
    queryFn: reservationApi.getTodaysCheckIns,
  })
}

export function useMyReservations() {
  return useQuery({
    queryKey: reservationKeys.my,
    queryFn: reservationApi.getMyReservations,
  })
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
      queryClient.invalidateQueries({ queryKey: reservationKeys.all })
      queryClient.invalidateQueries({ queryKey: reservationKeys.my })
    },
  })
}

export function useCheckin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reservationApi.checkin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all })
      queryClient.invalidateQueries({ queryKey: reservationKeys.today })
    },
  })
}

export function useCheckout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payment_method }: { id: number; payment_method: 'CASH' | 'CARD' }) =>
      reservationApi.checkout(id, { payment_method }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all })
      queryClient.invalidateQueries({ queryKey: reservationKeys.today })
    },
  })
}