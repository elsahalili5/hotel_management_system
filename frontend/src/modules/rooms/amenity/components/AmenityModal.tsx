import { useForm } from 'react-hook-form'
import { Modal } from '#/components/Modal'
import { Button } from '#/components/Button'
import { Input } from '#/components/Input'
import type { CreateAmenityInput, AmenityResponse } from '@mansio/shared'

interface AmenityModalProps {
  onClose: () => void
  onSubmit: (data: CreateAmenityInput) => Promise<void>
  defaultValues?: Partial<AmenityResponse>
  isPending?: boolean
  isError?: boolean
  title?: string
}

const lbl = 'text-xs tracking-widest uppercase mb-1 block text-mansio-mocha'

export function AmenityModal({ onClose, onSubmit, defaultValues, isPending, isError, title = 'Add Amenity' }: AmenityModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateAmenityInput>({
    defaultValues: defaultValues
      ? { name: defaultValues.name, icon: defaultValues.icon ?? undefined }
      : undefined,
  })

  return (
    <Modal title={title} onClose={onClose} maxWidth="max-w-sm">
      <form onSubmit={handleSubmit(async (values) => await onSubmit(values))} className="flex flex-col gap-4">
        <div>
          <label className={lbl}>Name *</label>
          <Input {...register('name', { required: true })} error={!!errors.name} placeholder="e.g. Free WiFi" />
        </div>

        <div>
          <label className={lbl}>Icon</label>
          <Input {...register('icon')} placeholder="e.g. Wifi, Wind, Tv" />
          <p className="text-xs mt-1 text-mansio-mocha">Lucide icon name (PascalCase)</p>
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
