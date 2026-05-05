import { useForm } from 'react-hook-form'
import { Modal } from '#/modules/admin/components/Modal'
import { Button } from '#/components/Button'
import type { CreateBedInput, BedResponse } from '@mansio/shared'

interface BedModalProps {
  onClose: () => void
  onSubmit: (data: CreateBedInput) => Promise<void>
  defaultValues?: Partial<BedResponse>
  isPending?: boolean
  isError?: boolean
  title?: string
}

const field = 'w-full border border-mansio-ink/10 rounded px-3 py-2 text-sm focus:outline-none'
const lbl = 'text-xs tracking-widest uppercase mb-1 block text-mansio-mocha'

export function BedModal({ onClose, onSubmit, defaultValues, isPending, isError, title = 'Add Bed' }: BedModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateBedInput>({
    defaultValues: defaultValues
      ? { name: defaultValues.name, capacity: defaultValues.capacity }
      : undefined,
  })

  const handleFormSubmit = handleSubmit(async (values) => {
    await onSubmit(values)
  })

  return (
    <Modal title={title} onClose={onClose} maxWidth="max-w-sm">
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <div>
          <label className={lbl}>Name *</label>
          <input {...register('name', { required: true })} className={field}
            style={{ borderColor: errors.name ? '#f87171' : undefined }} placeholder="e.g. King Bed" />
        </div>

        <div>
          <label className={lbl}>Capacity *</label>
          <input type="number" min={1} {...register('capacity', { required: true, valueAsNumber: true, min: 1 })}
            className={field} style={{ borderColor: errors.capacity ? '#f87171' : undefined }} placeholder="2" />
          <p className="text-xs mt-1 text-mansio-mocha">Number of persons this bed fits</p>
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