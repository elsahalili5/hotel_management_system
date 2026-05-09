import { useForm } from 'react-hook-form'
import { Modal } from '#/components/Modal'
import { Button } from '#/components/Button'
import { Input, labelClass } from '#/components/Input'
import { Textarea } from '#/components/Textarea'
import { Select } from '#/components/Select'
import { useRooms } from '#/modules/rooms/room/hooks/use-rooms'
import { useStaff } from '#/modules/staff/hooks/use-staff'
import { RoomStatus, ROLES, type CreateCleaningTaskInput } from '@mansio/shared'

interface CleaningTaskModalProps {
  onClose: () => void
  onSubmit: (data: CreateCleaningTaskInput) => Promise<void>
  isPending?: boolean
  isError?: boolean
  title?: string
}

const lbl = `${labelClass} font-semibold`

export function CleaningTaskModal({
  onClose,
  onSubmit,
  isPending,
  isError,
  title = 'Assign Cleaning Task',
}: CleaningTaskModalProps) {
  const { data: rooms } = useRooms()
  const { data: staff } = useStaff()

  const dirtyRooms = rooms?.filter((r) => r.status === RoomStatus.DIRTY)

  const housekeepers = staff?.filter((s: any) =>
    s.user?.user_roles?.some((ur: any) => ur.role?.name === ROLES.HOUSEKEEPING),
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCleaningTaskInput>()

  return (
    <Modal title={title} onClose={onClose} maxWidth="max-w-md">
      <form
        onSubmit={handleSubmit(async (values) => await onSubmit(values))}
        className="flex flex-col gap-4 mt-2"
      >
        <div>
          <label className={lbl}>Room (Dirty Only) *</label>
          <Select
            {...register('room_id', { required: true, valueAsNumber: true })}
            error={!!errors.room_id}
          >
            <option value="">Select a room...</option>
            {dirtyRooms?.map((r) => (
              <option key={r.id} value={r.id}>
                #{r.room_number} — Floor {r.floor}
              </option>
            ))}
          </Select>
          {errors.room_id && (
            <span className="text-[10px] text-red-500">Room is required</span>
          )}
          {dirtyRooms?.length === 0 && rooms && (
            <p className="text-[10px] text-amber-600 mt-1 italic">
              No dirty rooms available.
            </p>
          )}
        </div>

        <div>
          <label className={lbl}>Assign To (Housekeeper) *</label>
          <Select
            {...register('staff_id', { required: true, valueAsNumber: true })}
            error={!!errors.staff_id}
          >
            <option value="">Select housekeeper...</option>
            {housekeepers?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.user.first_name} {s.user.last_name}
              </option>
            ))}
          </Select>
          {errors.staff_id && (
            <span className="text-[10px] text-red-500">
              Please assign a staff member
            </span>
          )}
        </div>

        <div>
          <label className={lbl}>Due Date</label>
          <Input type="datetime-local" {...register('due_date')} />
        </div>

        <div>
          <label className={lbl}>Notes</label>
          <Textarea
            {...register('notes')}
            rows={3}
            placeholder="e.g. Check minibar, change towels..."
          />
        </div>

        {isError && (
          <p className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
            Failed to assign task. Please check if the room is already being
            cleaned.
          </p>
        )}

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-mansio-ink/5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Assigning...' : 'Assign Task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
