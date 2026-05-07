import { useForm } from 'react-hook-form'
import { Modal } from '#/modules/admin/components/Modal'
import { Button } from '#/components/Button'
import type { CreateExtraServiceInput, ExtraServiceResponse, ServiceCategoryResponse } from '@mansio/shared'

interface ExtraServiceModalProps {
  onClose: () => void
  onSubmit: (data: CreateExtraServiceInput) => Promise<void>
  defaultValues?: Partial<ExtraServiceResponse>
  categories: ServiceCategoryResponse[]
  isPending?: boolean
  isError?: boolean
  title?: string
}

const field = 'w-full border border-mansio-ink/10 rounded px-3 py-2 text-sm focus:outline-none'
const lbl = 'text-xs tracking-widest uppercase mb-1 block text-mansio-mocha'

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
      <form onSubmit={handleSubmit(async (values) => await onSubmit(values))} className="flex flex-col gap-4">
        <div>
          <label className={lbl}>Name *</label>
          <input
            {...register('name', { required: true })}
            className={`${field} ${errors.name ? 'border-red-400' : ''}`}
            placeholder="e.g. Airport Transfer"
          />
        </div>

        <div>
          <label className={lbl}>Description</label>
          <textarea
            {...register('description')}
            className={`${field} resize-none`}
            rows={2}
            placeholder="Optional description"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className={lbl}>Price *</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { required: true, valueAsNumber: true })}
              className={`${field} ${errors.price ? 'border-red-400' : ''}`}
              placeholder="0.00"
            />
          </div>
          <div className="flex-1">
            <label className={lbl}>Category *</label>
            <select
              {...register('category_id', { required: true, valueAsNumber: true })}
              className={`${field} ${errors.category_id ? 'border-red-400' : ''}`}
            >
              <option value="">Select...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register('is_available_24h')} id="is_available_24h" className="accent-mansio-gold" />
            <label htmlFor="is_available_24h" className="text-sm text-mansio-ink">24h Available</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register('is_active')} id="is_active" className="accent-mansio-gold" />
            <label htmlFor="is_active" className="text-sm text-mansio-ink">Active</label>
          </div>
        </div>

        {!is24h && (
          <div className="flex gap-4">
            <div className="flex-1">
              <label className={lbl}>Available From</label>
              <input
                type="time"
                {...register('available_from')}
                className={field}
              />
            </div>
            <div className="flex-1">
              <label className={lbl}>Available Until</label>
              <input
                type="time"
                {...register('available_until')}
                className={field}
              />
            </div>
          </div>
        )}

        {isError && (
          <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
        )}

        <div className="flex justify-end gap-3 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </Modal>
  )
}
