import { useForm } from 'react-hook-form'
import { Modal } from '#/modules/admin/components/Modal'
import { Button } from '#/components/Button'
import { Input, fieldClass } from '#/components/Input'
import { useRoomTypes } from '#/modules/rooms/room-type/hooks/use-room-types'
import { RoomStatus } from '@mansio/shared'
import type { CreateRoomInput, RoomResponse } from '@mansio/shared'

const lbl = 'text-xs tracking-widest uppercase mb-1 block text-mansio-mocha'

interface RoomModalProps {
  onClose: () => void
  onSubmit: (data: CreateRoomInput) => Promise<void>
  defaultValues?: Partial<RoomResponse>
  isPending?: boolean
  isError?: boolean
  title?: string
}

export function RoomModal({
  onClose,
  onSubmit,
  defaultValues,
  isPending,
  isError,
  title = 'Add Room',
}: RoomModalProps) {
  const { data: roomTypes } = useRoomTypes()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomInput>({
    defaultValues: defaultValues
      ? {
          room_number: defaultValues.room_number,
          floor: defaultValues.floor,
          room_type_id: defaultValues.room_type?.id,
          status: defaultValues.status,
        }
      : { status: RoomStatus.AVAILABLE },
  })

  return (
    <Modal title={title} onClose={onClose} maxWidth="max-w-sm">
      <form
        onSubmit={handleSubmit(async (values) => await onSubmit(values))}
        className="flex flex-col gap-4"
      >
        <div>
          <label className={lbl}>Room Number *</label>
          <Input
            {...register('room_number', { required: true })}
            error={!!errors.room_number}
            placeholder="e.g. 101"
          />
        </div>

        <div>
          <label className={lbl}>Floor *</label>
          <Input
            type="number"
            min={0}
            {...register('floor', { required: true, valueAsNumber: true })}
            error={!!errors.floor}
            placeholder="1"
          />
        </div>

        <div>
          <label className={lbl}>Room Type *</label>
          <select
            {...register('room_type_id', {
              required: true,
              valueAsNumber: true,
            })}
            className={`${fieldClass} ${errors.room_type_id ? 'border-red-400' : ''}`}
          >
            <option value="">Select room type...</option>
            {roomTypes?.map((rt) => (
              <option key={rt.id} value={rt.id}>
                {rt.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={lbl}>Status</label>
          <select {...register('status')} className={fieldClass}>
            {Object.values(RoomStatus).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
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
