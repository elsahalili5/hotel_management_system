import { useForm } from 'react-hook-form'
import { Modal } from '#/components/Modal'
import { Button } from '#/components/Button'
import { Input, labelClass } from '#/components/Input'
import { Textarea } from '#/components/Textarea'
import { Select } from '#/components/Select'
import type {
  CreateExtraServiceInput,
  ExtraServiceResponse,
  ServiceCategoryResponse,
} from '@mansio/shared'

interface ExtraServiceModalProps {
  onClose: () => void
  onSubmit: (data: CreateExtraServiceInput) => Promise<void>
  defaultValues?: Partial<ExtraServiceResponse>
  categories: ServiceCategoryResponse[]
  isPending?: boolean
  isError?: boolean
  title?: string
}


export function ExtraServiceModal({
  onClose,
  onSubmit,
  defaultValues,
  categories,
  isPending,
  isError,
  title = 'Add Service',
}: ExtraServiceModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateExtraServiceInput>({
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          description: defaultValues.description ?? undefined,
          price: Number(defaultValues.price) ?? 0,
          is_active: defaultValues.is_active ?? true,
          is_available_24h: defaultValues.is_available_24h ?? false,
          available_from: defaultValues.available_from ?? undefined,
          available_until: defaultValues.available_until ?? undefined,
          category_id: defaultValues.category?.id,
        }
      : { is_active: true, is_available_24h: false },
  })

  const is24h = watch('is_available_24h')

  return (
    <Modal title={title} onClose={onClose} maxWidth="max-w-md">
      <form
        onSubmit={handleSubmit(async (values) => await onSubmit(values))}
        className="flex flex-col gap-4"
      >
        <div>
          <label className={labelClass}>Name *</label>
          <Input
            {...register('name', { required: true })}
            error={!!errors.name}
            placeholder="e.g. Airport Transfer"
          />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <Textarea
            {...register('description')}
            rows={2}
            placeholder="Optional description"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className={labelClass}>Price *</label>
            <Input
              type="number"
              step="0.01"
              {...register('price', { required: true, valueAsNumber: true })}
              error={!!errors.price}
              placeholder="0.00"
            />
          </div>
          <div className="flex-1">
            <label className={labelClass}>Category *</label>
            <Select
              {...register('category_id', { required: true, valueAsNumber: true })}
              error={!!errors.category_id}
            >
              <option value="">Select...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('is_available_24h')}
              id="is_available_24h"
              className="accent-mansio-gold"
            />
            <label htmlFor="is_available_24h" className="text-sm text-mansio-ink">
              24h Available
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('is_active')}
              id="is_active"
              className="accent-mansio-gold"
            />
            <label htmlFor="is_active" className="text-sm text-mansio-ink">
              Active
            </label>
          </div>
        </div>

        {!is24h && (
          <div className="flex gap-4">
            <div className="flex-1">
              <label className={labelClass}>Available From</label>
              <Input type="time" {...register('available_from')} />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Available Until</label>
              <Input type="time" {...register('available_until')} />
            </div>
          </div>
        )}

        {isError && (
          <p className="text-xs text-red-500">
            Something went wrong. Please try again.
          </p>
        )}

        <div className="flex justify-end gap-3 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}