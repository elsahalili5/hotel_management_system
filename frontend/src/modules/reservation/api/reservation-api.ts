import { apiClient } from '#/api/client'
import type {
  AvailabilityQuery,
  CreateReservationInput,
  CheckoutInput,
  ReservationResponse,
} from '@mansio/shared'

export type { AvailabilityQuery, CreateReservationInput, CheckoutInput, ReservationResponse }

export type AvailabilityResult = {
  available: boolean
  room_id: number | undefined
  room_type_id: number
  check_in_date: string
  check_out_date: string
  nights: number
  base_price: number
  total_price: number
  max_occupancy: number
}

export const reservationApi = {
  checkAvailability: (params: AvailabilityQuery) =>
    apiClient.get<AvailabilityResult>('/reservations/availability', { params }),

  create: (data: CreateReservationInput) =>
    apiClient.post<ReservationResponse, CreateReservationInput>('/reservations', data),

  getAll: () => apiClient.get<ReservationResponse[]>('/reservations'),

  getTodaysCheckIns: () => apiClient.get<ReservationResponse[]>('/reservations/today/arrivals'),

  getTodaysCheckOuts: () => apiClient.get<ReservationResponse[]>('/reservations/today/departures'),

  getById: (id: number) => apiClient.get<ReservationResponse>(`/reservations/${id}`),

  getMyReservations: () => apiClient.get<ReservationResponse[]>('/reservations/my-reservations'),

  checkin: (id: number) =>
    apiClient.post<ReservationResponse, Record<string, never>>(`/reservations/${id}/checkin`, {}),

  noShow: (id: number) =>
    apiClient.post<ReservationResponse, Record<string, never>>(`/reservations/${id}/no-show`, {}),

  checkout: (id: number, data: CheckoutInput) =>
    apiClient.post<ReservationResponse, CheckoutInput>(`/reservations/${id}/checkout`, data),

  delete: (id: number) =>
    apiClient.delete<void>(`/reservations/${id}`),
}