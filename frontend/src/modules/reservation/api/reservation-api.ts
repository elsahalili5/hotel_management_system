import { apiClient } from '#/api/client'

export type AvailabilityQuery = {
  room_type_id: number
  check_in_date: string
  check_out_date: string
}

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

export type CreateReservationInput = {
  room_type_id: number
  check_in_date: string
  check_out_date: string
  adults: number
  children: number
  meal_plan_id?: number
}

export type ReservationResponse = {
  id: number
  status: string
  check_in_date: string
  check_out_date: string
  adults: number
  children: number
  room: { id: number; room_number: string }
  meal_plan: { id: number; name: string } | null
  invoice: {
    id: number
    status: string
    items: { id: number; description: string; quantity: number; unit_price: number; total: number }[]
    payments: { id: number; amount: number; method: string; status: string }[]
  } | null
}

export const reservationApi = {
  checkAvailability: (params: AvailabilityQuery) =>
    apiClient.get<AvailabilityResult>('/reservations/availability', { params }),

  create: (data: CreateReservationInput) =>
    apiClient.post<ReservationResponse, CreateReservationInput>('/reservations', data),
}
