import { ArrowLeft } from 'lucide-react'
import { Button } from '#/components/Button'
import type { DetailsForm } from './BookingDetails'
import type { AvailabilityResult } from '#/modules/reservation/api/reservation-api'

interface Props {
  form: DetailsForm
  availability: AvailabilityResult
  roomTypeName: string
  mealPlanName?: string
  mealPlanPrice?: number
  onBack: () => void
  onContinue: () => void
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const Row = ({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) => (
  <div
    className={`flex justify-between text-sm ${bold ? 'font-medium text-mansio-espresso' : 'text-mansio-mocha'}`}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
)

const Divider = () => <div className="h-px bg-mansio-ink/8" />

export function BookingSummary({
  form,
  availability,
  roomTypeName,
  mealPlanName,
  mealPlanPrice,
  onBack,
  onContinue,
}: Props) {
  const { nights, base_price, total_price } = availability
  const mealCost = (mealPlanPrice ?? 0) * nights
  const childDiscount =
    form.children > 0
      ? Math.round(total_price * Math.min(form.children * 0.1, 0.5) * 100) / 100
      : 0
  const total = total_price + mealCost - childDiscount

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-mansio-ivory border border-mansio-ink/8 rounded p-5 flex flex-col gap-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-mansio-gold mb-1">
            Room
          </p>
          <p className="font-serif text-lg text-mansio-espresso">
            {roomTypeName}
          </p>
        </div>

        <Divider />

        <div className="flex flex-col gap-2">
          <Row label="Check-in" value={fmt(form.checkIn)} />
          <Row label="Check-out" value={fmt(form.checkOut)} />
          <Row
            label="Duration"
            value={`${nights} night${nights !== 1 ? 's' : ''}`}
          />
          <Row
            label="Guests"
            value={`${form.adults} adult${form.adults !== 1 ? 's' : ''}${form.children > 0 ? ` · ${form.children} children` : ''}`}
          />
          {mealPlanName && <Row label="Meal Plan" value={mealPlanName} />}
        </div>

        <Divider />

        <div className="flex flex-col gap-2">
          <Row
            label={`Room (${nights} × €${base_price.toFixed(0)})`}
            value={`€${total_price.toFixed(2)}`}
          />
          {mealCost > 0 && (
            <Row
              label={`${mealPlanName} (${nights} × €${mealPlanPrice?.toFixed(0)})`}
              value={`€${mealCost.toFixed(2)}`}
            />
          )}
          {childDiscount > 0 && (
            <Row
              label="Children discount"
              value={`−€${childDiscount.toFixed(2)}`}
            />
          )}
          <Divider />
          <Row label="Total" value={`€${total.toFixed(2)}`} bold />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          startIcon={<ArrowLeft size={14} />}
          onClick={onBack}
        >
          Back
        </Button>
        <Button onClick={onContinue} className="flex-1 justify-center">
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}
