import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Container } from '#/components/Container'
import { StepIndicator } from '#/modules/reservation/components/booking/StepIndicator'
import {
  BookingDetails,
  type DetailsForm,
} from '#/modules/reservation/components/booking/BookingDetails'
import { BookingSummary } from '#/modules/reservation/components/booking/BookingSummary'
import { BookingPayment } from '#/modules/reservation/components/booking/BookingPayment'
import { BookingSuccess } from '#/modules/reservation/components/booking/BookingSuccess'
import { useCreateReservation } from '#/modules/reservation/hooks/use-reservations'
import { useMealPlans } from '#/modules/meal-plan/hooks/use-meal-plans'
import { useRoomTypes } from '#/modules/rooms/room-type/hooks/use-room-types'
import type {
  AvailabilityResult,
  ReservationResponse,
} from '#/modules/reservation/api/reservation-api'

export const Route = createFileRoute('/(app)/(private)/bookings')({
  validateSearch: (search: Record<string, unknown>) => ({
    roomTypeId: search.roomTypeId ? Number(search.roomTypeId) : undefined,
  }),
  component: BookingsPage,
})

type Step = 1 | 2 | 3 | 'success'
type BookingState = {
  form: DetailsForm
  availability: AvailabilityResult
  reservation: ReservationResponse
}

export function BookingsPage() {
  const { roomTypeId } = Route.useSearch()
  const [step, setStep] = useState<Step>(1)
  const [state, setState] = useState<Partial<BookingState>>({})

  const { data: roomTypes } = useRoomTypes()
  const { data: mealPlans } = useMealPlans()
  const { mutateAsync: createReservation, isPending } = useCreateReservation()

  const mealPlan = mealPlans?.find((mp) => mp.id === state.form?.mealPlanId)
  const roomTypeName =
    roomTypes?.find((rt) => rt.id === state.form?.roomTypeId)?.name ?? ''
  const mealPlanPrice = mealPlan ? Number(mealPlan.price_per_night) : undefined

  const handlePay = async () => {
    if (!state.form || !state.availability) return
    const { form } = state
    const reservation = await createReservation({
      room_type_id: form.roomTypeId,
      check_in_date: new Date(form.checkIn),
      check_out_date: new Date(form.checkOut),
      adults: form.adults,
      children: form.children,
      meal_plan_id: form.mealPlanId,
    })
    setState((p) => ({ ...p, reservation }))
    setStep('success')
  }

  return (
    <main className="min-h-screen bg-mansio-cream py-16">
      <Container className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs tracking-widest uppercase text-mansio-gold mb-2">
            Reserve Your Stay
          </p>
          <h1 className="font-serif text-3xl text-mansio-espresso">
            {step === 'success' ? 'Booking Complete' : 'Book a Room'}
          </h1>
        </div>

        {step !== 'success' && <StepIndicator current={step as 1 | 2 | 3} />}

        <div className="bg-white border border-mansio-ink/8 rounded-lg p-6 sm:p-8 shadow-sm">
          {step === 1 && (
            <BookingDetails
              initial={{ roomTypeId }}
              onContinue={(form, availability) => {
                setState({ form, availability })
                setStep(2)
              }}
            />
          )}

          {step === 2 && state.form && state.availability && (
            <BookingSummary
              form={state.form}
              availability={state.availability}
              roomTypeName={roomTypeName}
              mealPlanName={mealPlan?.name}
              mealPlanPrice={mealPlanPrice}
              onBack={() => setStep(1)}
              onContinue={() => setStep(3)}
            />
          )}

          {step === 3 && state.form && state.availability && (
            <BookingPayment
              total={
                state.availability.total_price +
                (mealPlanPrice ?? 0) * state.availability.nights -
                (state.form.children > 0
                  ? Math.round(
                      state.availability.total_price *
                        Math.min(state.form.children * 0.1, 0.5) *
                        100,
                    ) / 100
                  : 0)
              }
              onBack={() => setStep(2)}
              onPay={handlePay}
              isPaying={isPending}
            />
          )}

          {step === 'success' &&
            state.form &&
            state.availability &&
            state.reservation && (
              <BookingSuccess
                reservationId={state.reservation.id}
                roomTypeName={roomTypeName}
                checkIn={state.form.checkIn}
                checkOut={state.form.checkOut}
                nights={state.availability.nights}
                total={
                  state.reservation.invoice?.items.reduce(
                    (s, i) => s + Number(i.total),
                    0,
                  ) ?? 0
                }
              />
            )}
        </div>
      </Container>
    </main>
  )
}
