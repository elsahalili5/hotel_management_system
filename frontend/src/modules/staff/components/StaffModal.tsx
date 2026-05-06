import { useForm } from 'react-hook-form'
import { Modal } from '#/modules/admin/components/Modal'
import { Button } from '#/components/Button'
import type { StaffResponse, UpdateStaffInput } from '@mansio/shared'

interface StaffModalProps {
  onClose: () => void
  onSubmit: (data: UpdateStaffInput) => Promise<void>
  defaultValues?: StaffResponse
  isPending?: boolean
  isError?: boolean
  title?: string
}

const field =
  'w-full border border-mansio-ink/10 rounded px-3 py-2 text-sm focus:outline-none'
const lbl = 'text-xs tracking-widest uppercase mb-1 block text-mansio-mocha'

export function StaffModal({
  onClose,
  onSubmit,
  defaultValues,
  isPending,
  isError,
  title = 'Edit Staff',
}: StaffModalProps) {
  const { register, handleSubmit } = useForm<UpdateStaffInput>({
    defaultValues: defaultValues
      ? {
          phone_number: defaultValues.phone_number ?? undefined,
          shift: defaultValues.shift,
        }
      : undefined,
  })

  function handleValid(values: UpdateStaffInput) {
    const cleaned = Object.fromEntries(
      Object.entries(values).filter(
        ([, v]) => v !== '' && v !== undefined && v !== null,
      ),
    ) as UpdateStaffInput
    return onSubmit(cleaned)
  }

  return (
    <Modal title={title} onClose={onClose} maxWidth="max-w-sm">
      <form onSubmit={handleSubmit(handleValid)} className="flex flex-col gap-4">
        <div>
          <label className={lbl}>Phone Number</label>
          <input
            {...register('phone_number')}
            className={field}
            placeholder="+383 44 000 000"
          />
        </div>

        <div>
          <label className={lbl}>Shift</label>
          <select {...register('shift')} className={field}>
            <option value="">Select shift</option>
            <option value="MORNING">Morning</option>
            <option value="AFTERNOON">Afternoon</option>
            <option value="NIGHT">Night</option>
          </select>
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
