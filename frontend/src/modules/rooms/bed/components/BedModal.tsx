import { useForm } from 'react-hook-form'
import { Modal } from '#/components/Modal'
import { Button } from '#/components/Button'
import { Input, labelClass } from '#/components/Input'
import type { CreateBedInput, BedResponse } from '@mansio/shared'

interface BedModalProps {
  onClose: () => void
  onSubmit: (data: CreateBedInput) => Promise<void>
  defaultValues?: Partial<BedResponse>
  isPending?: boolean
  isError?: boolean
  title?: string
}


export function BedModal({ onClose, onSubmit, defaultValues, isPending, isError, title = 'Add Bed' }: BedModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateBedInput>({
    defaultValues: defaultValues
      ? { name: defaultValues.name, capacity: defaultValues.capacity }
      : undefined,
  })

  return (
    <Modal title={title} onClose={onClose} maxWidth="max-w-sm">
      <form onSubmit={handleSubmit(async (values) => await onSubmit(values))} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <Input {...register('name', { required: true })} error={!!errors.name} placeholder="e.g. King Bed" />
        </div>

        <div>
          <label className={labelClass}>Capacity *</label>
          <Input
            type="number"
            min={1}
            {...register('capacity', { required: true, valueAsNumber: true, min: 1 })}
            error={!!errors.capacity}
            placeholder="2"
          />
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
