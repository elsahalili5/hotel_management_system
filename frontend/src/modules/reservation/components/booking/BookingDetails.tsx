import { useState } from 'react'
import { Input, labelClass } from '#/components/Input'
import { Select } from '#/components/Select'
import { Button } from '#/components/Button'
import { useRoomTypes } from '#/modules/rooms/room-type/hooks/use-room-types'
import { useMealPlans } from '#/modules/meal-plan/hooks/use-meal-plans'
import { useReservationAvailability } from '#/modules/reservation/hooks/use-reservations'
import type {
  AvailabilityResult,
  AvailabilityQuery,
} from '#/modules/reservation/api/reservation-api'

export type DetailsForm = {
  roomTypeId: number
  checkIn: string
  checkOut: string
  adults: number
  children: number
  mealPlanId?: number
}

interface Props {
  initial: Partial<DetailsForm>
  onContinue: (form: DetailsForm, availability: AvailabilityResult) => void
}

const today = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

export function BookingDetails({ initial, onContinue }: Props) {
  const [form, setForm] = useState<DetailsForm>({
    roomTypeId: initial.roomTypeId ?? 0,
    checkIn: initial.checkIn ?? today,
    checkOut: initial.checkOut ?? tomorrow,
    adults: initial.adults ?? 1,
    children: initial.children ?? 0,
    mealPlanId: initial.mealPlanId,
  })
  const [checked, setChecked] = useState(false)

  const { data: roomTypes } = useRoomTypes()
  const { data: mealPlans } = useMealPlans()

  const set = (patch: Partial<DetailsForm>) => {
    setForm((p) => ({ ...p, ...patch }))
    setChecked(false)
  }

  const query: AvailabilityQuery | null =
    checked && form.roomTypeId > 0
      ? {
          room_type_id: form.roomTypeId,
          check_in_date: new Date(form.checkIn),
          check_out_date: new Date(form.checkOut),
        }
      : null

  const {
    data: availability,
    isFetching,
    isError,
  } = useReservationAvailability(query, checked)

  const canCheck = form.roomTypeId > 0 && form.checkIn < form.checkOut

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Room Type</label>
          <Select
            value={form.roomTypeId || ''}
            onChange={(e) => set({ roomTypeId: Number(e.target.value) })}
          >
            <option value="">Select a room type</option>
            {roomTypes?.map((rt) => (
              <option key={rt.id} value={rt.id}>
                {rt.name} — €{Number(rt.base_price).toFixed(0)} / night
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className={labelClass}>Check-in</label>
          <Input
            type="date"
            min={today}
            value={form.checkIn}
            onChange={(e) => set({ checkIn: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Check-out</label>
          <Input
            type="date"
            min={form.checkIn || today}
            value={form.checkOut}
            onChange={(e) => set({ checkOut: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Adults</label>
          <Input
            type="number"
            min={1}
            max={10}
            value={form.adults}
            onChange={(e) => set({ adults: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className={labelClass}>Children</label>
          <Input
            type="number"
            min={0}
            max={10}
            value={form.children}
            onChange={(e) => set({ children: Number(e.target.value) })}
          />
        </div>

        <div className="col-span-2">
          <label className={labelClass}>
            Meal Plan{' '}
            <span className="normal-case text-mansio-mocha/50">(optional)</span>
          </label>
          <Select
            value={form.mealPlanId ?? ''}
            onChange={(e) =>
              set({
                mealPlanId: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          >
            <option value="">No meal plan</option>
            {mealPlans?.map((mp) => (
              <option key={mp.id} value={mp.id}>
                {mp.name} — €{Number(mp.price_per_night).toFixed(0)} / night
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Button
        variant="outline"
        disabled={!canCheck || isFetching}
        onClick={() => setChecked(true)}
      >
        {isFetching ? 'Checking...' : 'Check Availability'}
      </Button>

      {isError && (
        <p className="text-sm text-red-500">
          Failed to check availability. Please try again.
        </p>
      )}

      {availability && (
        <div
          className={`px-4 py-3 rounded text-sm ${availability.available ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
        >
          {availability.available ? (
            <span className="text-mansio-espresso">
              {availability.nights}n · €{availability.base_price.toFixed(0)}
              /night ·{' '}
              <strong>Total €{availability.total_price.toFixed(2)}</strong>
            </span>
          ) : (
            <span className="text-red-600">
              No rooms available for these dates.
            </span>
          )}
        </div>
      )}

      {availability?.available && (
        <Button onClick={() => onContinue(form, availability)}>Continue</Button>
      )}
    </div>
  )
}
