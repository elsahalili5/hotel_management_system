import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AvailabilityQuery, CreateReservationInput } from '../api/reservation-api'
import { reservationApi } from '../api/reservation-api'

export const reservationKeys = {
  all:             ['reservations'] as const,
  todayArrivals:   ['reservations', 'today', 'arrivals'] as const,
  todayDepartures: ['reservations', 'today', 'departures'] as const,
  my:              ['reservations', 'my'] as const,
  detail:          (id: number) => ['reservations', id] as const,
  availability:    (q: AvailabilityQuery) =>
    ['reservations', 'availability', q.room_type_id, q.check_in_date, q.check_out_date] as const,
}

const invalidateLists = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: reservationKeys.all })
  qc.invalidateQueries({ queryKey: reservationKeys.todayArrivals })
  qc.invalidateQueries({ queryKey: reservationKeys.todayDepartures })
}

export function useReservations() {
  return useQuery({ queryKey: reservationKeys.all, queryFn: reservationApi.getAll })
}

export function useTodaysCheckIns() {
  return useQuery({ queryKey: reservationKeys.todayArrivals, queryFn: reservationApi.getTodaysCheckIns })
}

export function useTodaysCheckOuts() {
  return useQuery({ queryKey: reservationKeys.todayDepartures, queryFn: reservationApi.getTodaysCheckOuts })
}

export function useReservation(id: number) {
  return useQuery({
    queryKey: reservationKeys.detail(id),
    queryFn: () => reservationApi.getById(id),
    enabled: id > 0,
  })
}

export function useMyReservations() {
  return useQuery({ queryKey: reservationKeys.my, queryFn: reservationApi.getMyReservations })
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
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReservationInput) => reservationApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reservationKeys.all })
      qc.invalidateQueries({ queryKey: reservationKeys.my })
    },
  })
}

export function useCheckin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reservationApi.checkin(id),
    onSuccess: () => invalidateLists(qc),
  })
}

export function useNoShow() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reservationApi.noShow(id),
    onSuccess: () => invalidateLists(qc),
  })
}

export function useCheckout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payment_method }: { id: number; payment_method: 'CASH' | 'CARD' }) =>
      reservationApi.checkout(id, { payment_method }),
    onSuccess: () => invalidateLists(qc),
  })
}

export function useDeleteReservation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reservationApi.delete(id),
    onSuccess: () => invalidateLists(qc),
  })
}