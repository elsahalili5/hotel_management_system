import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '#/components/Button'
import { Modal } from '#/modules/admin/components/Modal'
import type {
  CreateGuestInput,
  CreateStaffInput,
  UpdateUserInput,
  UserResponse,
} from '@mansio/shared'

type UserCreatePayload = {
  account_type: 'GUEST' | 'STAFF'
  first_name: string
  last_name: string
  email: string
  password: string
  phone_number?: string
  address?: string
  city?: string
  country?: string
  passport_number?: string
  date_of_birth?: string
  role?: 'ADMIN' | 'MANAGER' | 'RECEPTIONIST' | 'HOUSEKEEPING'
  shift?: 'MORNING' | 'AFTERNOON' | 'NIGHT'
}

type UserEditPayload = UpdateUserInput & {
  is_active?: boolean
  role?: 'ADMIN' | 'MANAGER' | 'RECEPTIONIST' | 'HOUSEKEEPING' | 'GUEST'
}

export type { UserEditPayload }

interface UserModalProps {
  mode: 'create' | 'edit'
  onClose: () => void
  onCreate?: (data: CreateGuestInput | CreateStaffInput) => Promise<void>
  onEdit?: (data: UserEditPayload) => Promise<void>
  defaultValues?: UserResponse
  isPending?: boolean
  isError?: boolean
}

const field =
  'w-full border border-mansio-ink/10 rounded px-3 py-2 text-sm focus:outline-none'
const lbl = 'text-xs tracking-widest uppercase mb-1 block text-mansio-mocha'

export function UserModal({
  mode,
  onClose,
  onCreate,
  onEdit,
  defaultValues,
  isPending,
  isError,
}: UserModalProps) {
  const isStaff = !!defaultValues?.staff_profile

  const { register, handleSubmit, watch, setValue } = useForm<
    UserCreatePayload & UserEditPayload
  >({
    defaultValues:
      mode === 'edit' && defaultValues
        ? {
            first_name: defaultValues.first_name,
            last_name: defaultValues.last_name,
            email: defaultValues.email,
            status: defaultValues.status as UserEditPayload['status'],
            role: (defaultValues.user_roles?.[0]?.role?.name ?? undefined) as UserEditPayload['role'],
            is_active: isStaff
              ? (defaultValues.staff_profile as any)?.is_active ?? true
              : undefined,
          }
        : {
            account_type: 'GUEST',
            shift: 'MORNING',
          },
  })

  const accountType = watch('account_type')

  useEffect(() => {
    if (accountType === 'STAFF') {
      setValue('role', 'RECEPTIONIST')
      setValue('shift', 'MORNING')
    }
  }, [accountType, setValue])

  async function handleValid(values: UserCreatePayload & UserEditPayload) {
    if (mode === 'edit' && onEdit) {
      const payload: UserEditPayload = {}
      if (values.first_name) payload.first_name = values.first_name
      if (values.last_name) payload.last_name = values.last_name
      if (values.email) payload.email = values.email
      if (values.password) payload.password = values.password
      if (values.status) payload.status = values.status
      if (values.role) payload.role = values.role
      if (isStaff && values.is_active !== undefined)
        payload.is_active = values.is_active
      return onEdit(payload)
    }

    if (mode === 'create' && onCreate) {
      if (values.account_type === 'STAFF') {
        const staffData: CreateStaffInput = {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
          role: values.role!,
          phone_number: values.phone_number || undefined,
          shift: values.shift || undefined,
        }
        return onCreate(staffData)
      }

      const guestData: CreateGuestInput = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        phone_number: values.phone_number || undefined,
        address: values.address || undefined,
        city: values.city || undefined,
        country: values.country || undefined,
        passport_number: values.passport_number || undefined,
        date_of_birth: values.date_of_birth
          ? new Date(values.date_of_birth)
          : undefined,
      }
      return onCreate(guestData)
    }
  }

  return (
    <Modal
      title={mode === 'create' ? 'Add User' : 'Edit User'}
      onClose={onClose}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit(handleValid)} className="flex flex-col gap-4">
        {mode === 'create' && (
          <div>
            <label className={lbl}>Account Type</label>
            <select {...register('account_type')} className={field}>
              <option value="GUEST">Guest</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>First Name</label>
            <input {...register('first_name')} className={field} />
          </div>
          <div>
            <label className={lbl}>Last Name</label>
            <input {...register('last_name')} className={field} />
          </div>
        </div>

        <div>
          <label className={lbl}>Email</label>
          <input type="email" {...register('email')} className={field} />
        </div>

        <div>
          <label className={lbl}>
            Password {mode === 'edit' ? '(optional)' : ''}
          </label>
          <input
            type="password"
            {...register('password')}
            className={field}
            placeholder={mode === 'edit' ? 'Leave empty to keep current' : ''}
          />
        </div>

        {mode === 'edit' && (
          <>
            <div>
              <label className={lbl}>Status</label>
              <select {...register('status')} className={field}>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="LOCKED">Locked</option>
                <option value="DISABLED">Disabled</option>
              </select>
            </div>

            <div>
              <label className={lbl}>Role</label>
              <select {...register('role')} className={field}>
                <option value="GUEST">Guest</option>
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="HOUSEKEEPING">Housekeeping</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {isStaff && (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  {...register('is_active')}
                  className="w-4 h-4 accent-mansio-ink"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm text-mansio-mocha cursor-pointer"
                >
                  Staff is active
                </label>
              </div>
            )}
          </>
        )}

        {mode === 'create' && (
          <>
            <div>
              <label className={lbl}>Phone Number</label>
              <input
                {...register('phone_number')}
                className={field}
                placeholder="+383 44 000 000"
              />
            </div>

            {accountType === 'GUEST' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Address</label>
                    <input {...register('address')} className={field} />
                  </div>
                  <div>
                    <label className={lbl}>City</label>
                    <input {...register('city')} className={field} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Country</label>
                    <input {...register('country')} className={field} />
                  </div>
                  <div>
                    <label className={lbl}>Date of Birth</label>
                    <input
                      type="date"
                      {...register('date_of_birth')}
                      className={field}
                    />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Passport Number</label>
                  <input {...register('passport_number')} className={field} />
                </div>
              </>
            )}

            {accountType === 'STAFF' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Role</label>
                  <select {...register('role')} className={field}>
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="RECEPTIONIST">Receptionist</option>
                    <option value="HOUSEKEEPING">Housekeeping</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Shift</label>
                  <select {...register('shift')} className={field}>
                    <option value="MORNING">Morning</option>
                    <option value="AFTERNOON">Afternoon</option>
                    <option value="NIGHT">Night</option>
                  </select>
                </div>
              </div>
            )}
          </>
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
