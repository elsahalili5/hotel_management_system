import { useForm } from 'react-hook-form'
import { Modal } from '#/modules/admin/components/Modal'
import { Button } from '#/components/Button'
import { Input, fieldClass } from '#/components/Input'
import type {
  CreateServiceCategoryInput,
  ServiceCategoryResponse,
} from '@mansio/shared'

interface ServiceCategoryModalProps {
  onClose: () => void
  onSubmit: (data: CreateServiceCategoryInput) => Promise<void>
  defaultValues?: Partial<ServiceCategoryResponse>
  isPending?: boolean
  isError?: boolean
  title?: string
}

const lbl = 'text-xs tracking-widest uppercase mb-1 block text-mansio-mocha'

export function ServiceCategoryModal({
  onClose,
  onSubmit,
  defaultValues,
  isPending,
  isError,
  title = 'Add Category',
}: ServiceCategoryModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateServiceCategoryInput>({
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          description: defaultValues.description ?? undefined,
          sort_order: defaultValues.sort_order ?? 0,
          is_active: defaultValues.is_active ?? true,
        }
      : { sort_order: 0, is_active: true },
  })

  return (
    <Modal title={title} onClose={onClose} maxWidth="max-w-sm">
      <form
        onSubmit={handleSubmit(async (values) => await onSubmit(values))}
        className="flex flex-col gap-4"
      >
        <div>
          <label className={lbl}>Name *</label>
          <Input
            {...register('name', { required: true })}
            error={!!errors.name}
            placeholder="e.g. Spa & Wellness"
          />
        </div>

        <div>
          <label className={lbl}>Description</label>
          <textarea
            {...register('description')}
            className={`${fieldClass} resize-none`}
            rows={3}
            placeholder="Optional description"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className={lbl}>Sort Order</label>
            <Input
              type="number"
              {...register('sort_order', { valueAsNumber: true })}
              placeholder="0"
            />
          </div>
          <div className="flex items-center gap-2 pt-5">
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
