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

  getTodaysCheckIns: () => apiClient.get<ReservationResponse[]>('/reservations/today'),

  getMyReservations: () => apiClient.get<ReservationResponse[]>('/reservations/my-reservations'),

  checkout: (id: number, data: CheckoutInput) =>
    apiClient.post<ReservationResponse, CheckoutInput>(`/reservations/${id}/checkout`, data),
}