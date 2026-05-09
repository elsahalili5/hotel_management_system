import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useEffect, useMemo, useState } from 'react'
import { ROLES } from '@mansio/shared'
import { requireRole } from '#/lib/route-guard'
import { Container } from '#/components/Container'
import { Button } from '#/components/Button'
import { Input, labelClass } from '#/components/Input'
import { Select } from '#/components/Select'
import { HeroSection } from '#/components/HeroSection'
import { useRoomTypes } from '#/modules/rooms/room-type/hooks/use-room-types'
import { useMealPlans } from '#/modules/meal-plan/hooks/use-meal-plans'
import {
  useReservationAvailability,
  useCreateReservation,
} from '#/modules/reservation/hooks/use-reservations'
import { isApiError } from '#/api/client'
import type { AvailabilityResult } from '#/modules/reservation/api/reservation-api'

type BookingsSearch = {
  roomTypeId?: number
}

type BookingFormValues = {
  room_type_id: string
  check_in: string
  check_out: string
  adults: number
  children: number
  meal_plan_id: string
}

type CardFormValues = {
  cardholder_name: string
  card_number: string
  expiry: string
  cvv: string
}

const CHILD_DISCOUNT_RATE = 0.1

function calcChildrenDiscount(roomCost: number, children: number) {
  if (children === 0) return 0
  const rate = Math.min(children * CHILD_DISCOUNT_RATE, 0.5)
  return Math.round(roomCost * rate * 100) / 100
}

function estimatePrepaid(
  availability: AvailabilityResult | undefined,
  mealPricePerNight: number | undefined,
  nights: number,
  children: number,
) {
  if (!availability) return null
  const mealCost = mealPricePerNight ? mealPricePerNight * nights : 0
  const discount = calcChildrenDiscount(availability.total_price, children)
  return Math.round((availability.total_price + mealCost - discount) * 100) / 100
}

function apiErrorMessage(error: unknown): string | null {
  if (!isApiError(error)) return null
  const data = error.response?.data as { error?: string } | undefined
  return data?.error ?? null
}

export const Route = createFileRoute('/(app)/bookings')({
  validateSearch: (search: Record<string, unknown>): BookingsSearch => {
    const raw = search.roomTypeId
    if (raw === undefined || raw === null || raw === '') return {}
    const n = Number(raw)
    return Number.isFinite(n) && n > 0 ? { roomTypeId: Math.floor(n) } : {}
  },
  beforeLoad: ({ context }) => {
    requireRole(context.auth, { role: ROLES.GUEST, redirectTo: '/dashboard' })
  },
  component: GuestBookingsPage,
})

function GuestBookingsPage() {
  const { roomTypeId: roomTypeIdFromUrl } = Route.useSearch()
  const navigate = useNavigate()
  const { data: roomTypes, isLoading: roomsLoading } = useRoomTypes()
  const { data: mealPlans, isLoading: mealsLoading } = useMealPlans()

  const activeMealPlans = useMemo(
    () => mealPlans?.filter((p) => p.is_active) ?? [],
    [mealPlans],
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BookingFormValues>({
    defaultValues: {
      room_type_id: roomTypeIdFromUrl ? String(roomTypeIdFromUrl) : '',
      check_in: '',
      check_out: '',
      adults: 2,
      children: 0,
      meal_plan_id: '',
    },
  })

  useEffect(() => {
    if (roomTypeIdFromUrl) setValue('room_type_id', String(roomTypeIdFromUrl))
  }, [roomTypeIdFromUrl, setValue])

  const roomTypeId = watch('room_type_id')
  const checkIn = watch('check_in')
  const checkOut = watch('check_out')
  const adults = watch('adults')
  const children = watch('children')
  const mealPlanId = watch('meal_plan_id')

  const roomTypeIdNum = roomTypeId ? Number(roomTypeId) : 0
  const datesValid =
    Boolean(checkIn) &&
    Boolean(checkOut) &&
    checkOut > checkIn &&
    roomTypeIdNum > 0

  const availabilityQuery = datesValid
    ? {
        room_type_id: roomTypeIdNum,
        check_in_date: checkIn,
        check_out_date: checkOut,
      }
    : null

  const { data: availability, isFetching: availabilityLoading } = useReservationAvailability(
    availabilityQuery,
    datesValid,
  )

  const selectedMeal = useMemo(() => {
    if (!mealPlanId) return undefined
    return activeMealPlans.find((p) => p.id === Number(mealPlanId))
  }, [mealPlanId, activeMealPlans])

  const mealPricePerNight = selectedMeal
    ? Number(selectedMeal.price_per_night)
    : undefined

  const estimatedPrepaid = estimatePrepaid(
    availability,
    mealPricePerNight,
    availability?.nights ?? 0,
    children,
  )

  const capacityOk =
    availability &&
    adults + children <= availability.max_occupancy

  const createReservation = useCreateReservation()
  const [createdId, setCreatedId] = useState<number | null>(null)
  const [step, setStep] = useState<'stay' | 'card'>('stay')

  const cardForm = useForm<CardFormValues>({
    defaultValues: {
      cardholder_name: '',
      card_number: '',
      expiry: '',
      cvv: '',
    },
  })
  const {
    register: registerCard,
    handleSubmit: handleCardSubmit,
    reset: resetCard,
    formState: { errors: cardErrors },
  } = cardForm

  const goToCardPayment = handleSubmit(() => {
    if (!availability?.available || !capacityOk) return
    setStep('card')
  })

  const submitReservation = handleCardSubmit(async () => {
    setCreatedId(null)
    const values = getValues()
    if (!availability?.available) return
    try {
      const payload = {
        room_type_id: Number(values.room_type_id),
        check_in_date: values.check_in,
        check_out_date: values.check_out,
        adults: values.adults,
        children: values.children,
        ...(values.meal_plan_id
          ? { meal_plan_id: Number(values.meal_plan_id) }
          : {}),
      }
      const res = await createReservation.mutateAsync(payload)
      setCreatedId(res.id)
      setStep('stay')
      resetCard()
    } catch {
      /* error surfaced via mutation */
    }
  })

  const createError =
    apiErrorMessage(createReservation.error) ??
    (createReservation.isError ? 'Could not complete booking.' : null)

  const canContinueToCard =
    Boolean(availability?.available) && Boolean(capacityOk) && step === 'stay'

  const canPay = step === 'card' && !createReservation.isPending

  const selectedRoomLabel = roomTypes?.find((r) => String(r.id) === roomTypeId)?.name

  return (
    <main className="min-h-screen bg-mansio-cream">
      <HeroSection
        height="340px"
        title="BOOK YOUR STAY"
        image="https://epidamn.com/assets/images/pamjedhoma.jpg"
      />

      <Container className="py-14 md:py-20 max-w-3xl">
        {createdId !== null && (
          <div className="mb-10 p-6 bg-mansio-ivory border-l-2 border-mansio-gold">
            <p className="text-xs tracking-widest uppercase text-mansio-gold mb-2">Confirmed</p>
            <p className="font-serif text-xl text-mansio-espresso mb-4">
              Reservation #{createdId} is confirmed.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/profile" className="no-underline">
                <Button>View profile</Button>
              </Link>
              <Link to="/rooms" className="no-underline">
                <Button variant="ghost">Browse more rooms</Button>
              </Link>
            </div>
          </div>
        )}

        <p className="text-sm font-light text-mansio-mocha mb-8">
          Your guest profile must include phone, passport number, and date of birth before booking.
        </p>

        <div className="flex gap-6 text-xs tracking-widest uppercase mb-10 text-mansio-taupe">
          <span className={step === 'stay' ? 'text-mansio-espresso font-medium' : ''}>
            1 · Stay
          </span>
          <span aria-hidden className="text-mansio-gold/40">
            —
          </span>
          <span className={step === 'card' ? 'text-mansio-espresso font-medium' : ''}>
            2 · Card
          </span>
        </div>

        {step === 'stay' && (
          <form onSubmit={goToCardPayment} className="flex flex-col gap-8">
            <div>
              <label className={labelClass}>Room type</label>
              <Select
                {...register('room_type_id', { required: 'Choose a room type' })}
                error={Boolean(errors.room_type_id)}
              >
                <option value="">Select a room</option>
                {roomTypes?.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.name} — €{rt.base_price} / night · up to {rt.max_occupancy} guests
                  </option>
                ))}
              </Select>
              {errors.room_type_id && (
                <p className="text-xs text-red-500 mt-1">{errors.room_type_id.message}</p>
              )}
              {roomsLoading && <p className="text-xs text-mansio-taupe mt-1">Loading rooms…</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Check-in</label>
                <Input
                  type="date"
                  {...register('check_in', { required: true })}
                  error={Boolean(errors.check_in)}
                />
              </div>
              <div>
                <label className={labelClass}>Check-out</label>
                <Input
                  type="date"
                  {...register('check_out', { required: true })}
                  error={Boolean(errors.check_out)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Adults</label>
                <Input
                  type="number"
                  min={1}
                  {...register('adults', { valueAsNumber: true, min: 1 })}
                  error={Boolean(errors.adults)}
                />
              </div>
              <div>
                <label className={labelClass}>Children</label>
                <Input
                  type="number"
                  min={0}
                  {...register('children', { valueAsNumber: true, min: 0 })}
                  error={Boolean(errors.children)}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Meal plan (optional)</label>
              <Select {...register('meal_plan_id')}>
                <option value="">None</option>
                {activeMealPlans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — €{p.price_per_night} / night / guest
                  </option>
                ))}
              </Select>
              {mealsLoading && <p className="text-xs text-mansio-taupe mt-1">Loading meal plans…</p>}
            </div>

            <div className="p-6 bg-mansio-espresso/5 border border-mansio-gold/20">
              <p className="text-xs tracking-widest uppercase mb-3 text-mansio-gold">Availability</p>
              {!datesValid && (
                <p className="text-sm font-light text-mansio-mocha">
                  Choose room type and valid dates to see availability and pricing.
                </p>
              )}
              {datesValid && availabilityLoading && (
                <p className="text-sm font-light text-mansio-mocha">Checking availability…</p>
              )}
              {datesValid && !availabilityLoading && availability && (
                <div className="space-y-2 text-sm font-light text-mansio-mocha">
                  <p>
                    {availability.available ? (
                      <span className="text-mansio-espresso font-medium">Rooms available</span>
                    ) : (
                      <span className="text-red-600">No rooms available for these dates.</span>
                    )}
                  </p>
                  <p>
                    {availability.nights} night{availability.nights === 1 ? '' : 's'} · Max{' '}
                    {availability.max_occupancy} guests
                  </p>
                  {!capacityOk && (
                    <p className="text-red-600">
                      Guest count exceeds room capacity ({adults + children} &gt;{' '}
                      {availability.max_occupancy}).
                    </p>
                  )}
                  {availability.available && capacityOk && estimatedPrepaid !== null && (
                    <p className="pt-2 text-mansio-espresso">
                      Estimated prepaid (room + meal plan − child discount):{' '}
                      <span className="font-serif text-lg">€{estimatedPrepaid}</span>
                    </p>
                  )}
                  <p className="text-xs text-mansio-taupe pt-2">
                    Next step: enter your card details (demo — not sent to a payment gateway).
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={!canContinueToCard}>
                Continue to card payment
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate({ to: '/rooms' })}>
                Back to rooms
              </Button>
            </div>
          </form>
        )}

        {step === 'card' && (
          <form onSubmit={submitReservation} className="flex flex-col gap-8">
            <div className="p-5 bg-white border border-mansio-gold/25 text-sm text-mansio-mocha space-y-1">
              <p className="text-xs tracking-widest uppercase text-mansio-gold">Summary</p>
              <p>
                <span className="text-mansio-taupe">Room: </span>
                {selectedRoomLabel ?? '—'}
              </p>
              <p>
                <span className="text-mansio-taupe">Dates: </span>
                {checkIn} → {checkOut}
              </p>
              <p>
                <span className="text-mansio-taupe">Guests: </span>
                {adults} adults, {children} children
                {selectedMeal ? (
                  <>
                    {' '}
                    · <span className="text-mansio-taupe">Meal: </span>
                    {selectedMeal.name}
                  </>
                ) : null}
              </p>
              {estimatedPrepaid !== null && (
                <p className="pt-2 font-serif text-xl text-mansio-espresso">
                  Total due now €{estimatedPrepaid}
                </p>
              )}
            </div>

            <div>
              <p className="text-xs tracking-widest uppercase text-mansio-gold mb-4">Card</p>
              <div className="flex flex-col gap-5">
                <div>
                  <label className={labelClass}>Name on card</label>
                  <Input
                    {...registerCard('cardholder_name', { required: true })}
                    placeholder="As shown on card"
                    autoComplete="cc-name"
                    error={Boolean(cardErrors.cardholder_name)}
                  />
                  {cardErrors.cardholder_name && (
                    <p className="text-xs text-red-500 mt-1">Required</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Card number</label>
                  <Input
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="Card number"
                    {...registerCard('card_number', { required: true })}
                    error={Boolean(cardErrors.card_number)}
                  />
                  {cardErrors.card_number && (
                    <p className="text-xs text-red-500 mt-1">Required</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Expiry</label>
                    <Input
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      {...registerCard('expiry', { required: true })}
                      error={Boolean(cardErrors.expiry)}
                    />
                    {cardErrors.expiry && (
                      <p className="text-xs text-red-500 mt-1">Required</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>CVV</label>
                    <Input
                      type="password"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      maxLength={4}
                      placeholder="•••"
                      {...registerCard('cvv', { required: true })}
                      error={Boolean(cardErrors.cvv)}
                    />
                    {cardErrors.cvv && (
                      <p className="text-xs text-red-500 mt-1">Required</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-mansio-taupe">
              Card fields stay in your browser; only the reservation is sent to Mansio’s server.
            </p>

            {createError && <p className="text-sm text-red-600">{createError}</p>}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={!canPay}>
                {createReservation.isPending
                  ? 'Processing…'
                  : estimatedPrepaid !== null
                    ? `Pay €${estimatedPrepaid} & confirm`
                    : 'Confirm reservation'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('stay')}
                disabled={createReservation.isPending}
              >
                Edit stay details
              </Button>
            </div>
          </form>
        )}
      </Container>
    </main>
  )
}
