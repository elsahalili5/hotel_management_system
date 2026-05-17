import { useState } from 'react'
import { ArrowLeft, Lock } from 'lucide-react'
import { Input, labelClass } from '#/components/Input'
import { Button } from '#/components/Button'

interface Props {
  total: number
  onBack: () => void
  onPay: () => void
  isPaying: boolean
}

const fmtCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
const fmtExpiry = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }

export function BookingPayment({ total, onBack, onPay, isPaying }: Props) {
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' })
  const set = (patch: Partial<typeof card>) => setCard((p) => ({ ...p, ...patch }))

  const valid =
    card.name.trim().length > 2 &&
    card.number.replace(/\s/g, '').length === 16 &&
    card.expiry.length === 5 &&
    card.cvv.length >= 3

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs text-mansio-mocha bg-mansio-ivory border border-mansio-ink/8 rounded px-4 py-3 flex items-center gap-2">
        <Lock size={11} className="text-mansio-gold shrink-0" />
        Your payment information is secure and encrypted.
      </p>

      <div className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Cardholder Name</label>
          <Input placeholder="John Doe" value={card.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Card Number</label>
          <Input placeholder="0000 0000 0000 0000" value={card.number} onChange={(e) => set({ number: fmtCard(e.target.value) })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Expiry</label>
            <Input placeholder="MM/YY" value={card.expiry} onChange={(e) => set({ expiry: fmtExpiry(e.target.value) })} />
          </div>
          <div>
            <label className={labelClass}>CVV</label>
            <Input placeholder="123" type="password" maxLength={4} value={card.cvv} onChange={(e) => set({ cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" startIcon={<ArrowLeft size={14} />} onClick={onBack} disabled={isPaying}>Back</Button>
        <button
          disabled={!valid || isPaying}
          onClick={onPay}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-full bg-mansio-espresso text-mansio-cream transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Lock size={13} />
          {isPaying ? 'Processing...' : `Pay €${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  )
}