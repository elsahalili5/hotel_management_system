import { useForm } from 'react-hook-form'
import { Modal } from '#/components/Modal'
import { Button } from '#/components/Button'
import { Input } from '#/components/Input'
import { Select } from '#/components/Select'
import type { StaffResponse, UpdateStaffInput } from '@mansio/shared'

interface StaffModalProps {
  onClose: () => void
  onSubmit: (data: UpdateStaffInput) => Promise<void>
  defaultValues?: StaffResponse
  isPending?: boolean
  isError?: boolean
  title?: string
}

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
      <form
        onSubmit={handleSubmit(handleValid)}
        className="flex flex-col gap-4"
      >
        <div>
          <label className={lbl}>Phone Number</label>
          <Input {...register('phone_number')} placeholder="+383 44 000 000" />
        </div>

        <div>
          <label className={lbl}>Shift</label>
          <Select {...register('shift')}>
            <option value="">Select shift</option>
            <option value="MORNING">Morning</option>
            <option value="AFTERNOON">Afternoon</option>
            <option value="NIGHT">Night</option>
          </Select>
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
