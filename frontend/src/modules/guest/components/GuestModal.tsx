import { useForm } from 'react-hook-form'
import { Modal } from '#/modules/admin/components/Modal'
import { Button } from '#/components/Button'
import type { UpdateGuestInput, GuestResponse } from '@mansio/shared'

interface GuestModalProps {
  onClose: () => void
  onSubmit: (data: UpdateGuestInput) => Promise<void>
  defaultValues?: GuestResponse
  isPending?: boolean
  isError?: boolean
  title?: string
}

const field = 'w-full border border-mansio-ink/10 rounded px-3 py-2 text-sm focus:outline-none'
const lbl = 'text-xs tracking-widest uppercase mb-1 block text-mansio-mocha'

export function GuestModal({ onClose, onSubmit, defaultValues, isPending, isError, title = 'Edit Guest' }: GuestModalProps) {
  const { register, handleSubmit } = useForm<UpdateGuestInput>({
    defaultValues: defaultValues
      ? {
          phone_number: defaultValues.phone_number ?? undefined,
          address: defaultValues.address ?? undefined,
          city: defaultValues.city ?? undefined,
          country: defaultValues.country ?? undefined,
          passport_number: defaultValues.passport_number ?? undefined,
          date_of_birth: defaultValues.date_of_birth ?? undefined,
        }
      : undefined,
  })

  function handleValid(values: UpdateGuestInput) {
    const cleaned = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== '' && v !== undefined && v !== null)
    ) as UpdateGuestInput
    return onSubmit(cleaned)
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit(handleValid)} className="flex flex-col gap-4">
        <div>
          <label className={lbl}>Phone Number</label>
          <input {...register('phone_number')} className={field} placeholder="+383 44 000 000" />
        </div>

        <div>
          <label className={lbl}>Address</label>
          <input {...register('address')} className={field} placeholder="123 Main St" />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className={lbl}>City</label>
            <input {...register('city')} className={field} placeholder="Pristina" />
          </div>
          <div className="flex-1">
            <label className={lbl}>Country</label>
            <input {...register('country')} className={field} placeholder="Kosovo" />
          </div>
        </div>

        <div>
          <label className={lbl}>Passport Number</label>
          <input {...register('passport_number')} className={field} placeholder="AB123456" />
        </div>

        <div>
          <label className={lbl}>Date of Birth</label>
          <input type="date" {...register('date_of_birth')} className={field} />
        </div>

        {isError && <p className="text-xs text-red-500">Something went wrong. Please try again.</p>}

        <div className="flex justify-end gap-3 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </Modal>
  )
}
