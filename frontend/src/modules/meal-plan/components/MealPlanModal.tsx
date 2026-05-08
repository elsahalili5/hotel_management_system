import { useForm } from 'react-hook-form'
import { Modal } from '#/modules/admin/components/Modal'
import { Button } from '#/components/Button'
import { Input, fieldClass } from '#/components/Input'
import type { CreateMealPlanInput, MealPlanResponse } from '@mansio/shared'

interface MealPlanModalProps {
  onClose: () => void
  onSubmit: (data: CreateMealPlanInput) => Promise<void>
  defaultValues?: Partial<MealPlanResponse>
  isPending?: boolean
  isError?: boolean
  title?: string
}

const lbl = 'text-xs tracking-widest uppercase mb-1 block text-mansio-mocha'

export function MealPlanModal({
  onClose,
  onSubmit,
  defaultValues,
  isPending,
  isError,
  title = 'Add Meal Plan',
}: MealPlanModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMealPlanInput>({
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          description: defaultValues.description ?? undefined,
          price_per_night: Number(defaultValues.price_per_night) ?? 0,
          is_active: defaultValues.is_active ?? true,
        }
      : { is_active: true },
  })

  return (
    <Modal title={title} onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={handleSubmit(async (values) => await onSubmit(values))} className="flex flex-col gap-4">
        <div>
          <label className={lbl}>Name *</label>
          <Input
            {...register('name', { required: true })}
            error={!!errors.name}
            placeholder="e.g. Full Board"
          />
        </div>

        <div>
          <label className={lbl}>Description</label>
          <textarea
            {...register('description')}
            className={`${fieldClass} resize-none`}
            rows={2}
            placeholder="Optional description"
          />
        </div>

        <div>
          <label className={lbl}>Price per Night (€) *</label>
          <Input
            type="number"
            step="0.01"
            {...register('price_per_night', { required: true, valueAsNumber: true })}
            error={!!errors.price_per_night}
            placeholder="0.00"
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register('is_active')} id="is_active" className="accent-mansio-gold" />
          <label htmlFor="is_active" className="text-sm text-mansio-ink">Active</label>
        </div>

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
