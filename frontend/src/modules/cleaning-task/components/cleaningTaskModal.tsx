import { useForm } from 'react-hook-form'
import { Modal } from '#/modules/admin/components/Modal' 
import { Button } from '#/components/Button'
import { useRooms } from '#/modules/rooms/room/hooks/use-rooms'
import { useStaff } from '#/modules/staff/hooks/use-staff'

// Importet nga shared folder
import { 
  RoomStatus, 
  ROLES, 
  type CreateCleaningTaskInput 
} from '@mansio/shared'

interface CleaningTaskModalProps {
  onClose: () => void
  onSubmit: (data: CreateCleaningTaskInput) => Promise<void>
  isPending?: boolean
  isError?: boolean
  title?: string
}

const field = 'w-full border border-mansio-ink/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-mansio-ink/30 transition-colors'
const lbl = 'text-xs tracking-widest uppercase mb-1 block text-mansio-mocha font-semibold'

export function CleaningTaskModal({ 
  onClose, 
  onSubmit, 
  isPending, 
  isError, 
  title = 'Assign Cleaning Task' 
}: CleaningTaskModalProps) {
  
  // Marrja e të dhënave nga hook-et
  const { data: rooms } = useRooms()
  const { data: staff } = useStaff()

  // FILTRI 1: Vetëm dhomat që janë "DIRTY"
  const dirtyRooms = rooms?.filter((r) => r.status === RoomStatus.DIRTY)

  // FILTRI 2: Vetëm stafi që ka rolin "HOUSEKEEPER"
  // Shënim: Kontrollojmë s.user.role ose s.role bazuar në strukturën tuaj
const housekeepers = staff?.filter((s: any) => 
  s.user?.user_roles?.some((ur: any) => ur.role?.name === ROLES.HOUSEKEEPING)
);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<CreateCleaningTaskInput>()

  return (
    <Modal title={title} onClose={onClose} maxWidth="max-w-md">
      <form 
        onSubmit={handleSubmit(async (values) => await onSubmit(values))} 
        className="flex flex-col gap-4 mt-2"
      >
        {/* Zgjedhja e Dhomës */}
        <div>
          <label className={lbl}>Room (Dirty Only) *</label>
          <select 
            {...register('room_id', { required: true, valueAsNumber: true })}
            className={`${field} ${errors.room_id ? 'border-red-400' : ''}`}
          >
            <option value="">Select a room...</option>
            {dirtyRooms?.map((r) => (
              <option key={r.id} value={r.id}>
                #{r.room_number} — Floor {r.floor}
              </option>
            ))}
          </select>
          {errors.room_id && <span className="text-[10px] text-red-500">Room is required</span>}
          {dirtyRooms?.length === 0 && rooms && (
            <p className="text-[10px] text-amber-600 mt-1 italic">No dirty rooms available.</p>
          )}
        </div>

        {/* Zgjedhja e Stafit */}
        <div>
          <label className={lbl}>Assign To (Housekeeper) *</label>
          <select 
            {...register('staff_id', { required: true, valueAsNumber: true })}
            className={`${field} ${errors.staff_id ? 'border-red-400' : ''}`}
          >
            <option value="">Select housekeeper...</option>
            {housekeepers?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.user.first_name} {s.user.last_name}
              </option>
            ))}
          </select>
          {errors.staff_id && <span className="text-[10px] text-red-500">Please assign a staff member</span>}
        </div>

        {/* Data dhe Ora */}
        <div>
          <label className={lbl}>Due Date</label>
          <input 
            type="datetime-local" 
            {...register('due_date')} 
            className={field} 
          />
        </div>

        {/* Shënime Shtesë */}
        <div>
          <label className={lbl}>Notes</label>
          <textarea 
            {...register('notes')} 
            rows={3} 
            className={`${field} resize-none`} 
            placeholder="e.g. Check minibar, change towels..." 
          />
        </div>

        {/* Gabimet nga Serveri */}
        {isError && (
          <p className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
            Failed to assign task. Please check if the room is already being cleaned.
          </p>
        )}

        {/* Butonat e Veprimit */}
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