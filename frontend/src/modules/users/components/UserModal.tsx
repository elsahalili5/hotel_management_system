import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '#/components/Button'
import { Input } from '#/components/Input'
import { Select } from '#/components/Select'
import { Modal } from '#/components/Modal'
import { ROLES, SHIFTS } from '@mansio/shared'

import type {
  CreateGuestInput,
  CreateStaffInput,
  UpdateUserInput,
  UserResponse,
  RoleType,
  ShiftType,
} from '@mansio/shared'

const STAFF_ROLES = Object.values(ROLES).filter(
  (r) => r !== ROLES.GUEST,
) as Exclude<RoleType, 'GUEST'>[]

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
  role?: Exclude<RoleType, 'GUEST'>
  shift?: ShiftType
}

type UserEditPayload = UpdateUserInput & {
  is_active?: boolean
  role?: RoleType
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
              ? ((defaultValues.staff_profile as any)?.is_active ?? true)
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
      setValue('role', 'RECEPTIONIST' as never)
      setValue('shift', 'MORNING' as never)
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
            <Select {...register('account_type')}>
              <option value="GUEST">Guest</option>
              <option value="STAFF">Staff</option>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>First Name</label>
            <Input {...register('first_name')} />
          </div>
          <div>
            <label className={lbl}>Last Name</label>
            <Input {...register('last_name')} />
          </div>
        </div>

        <div>
          <label className={lbl}>Email</label>
          <Input type="email" {...register('email')} />
        </div>

        <div>
          <label className={lbl}>
            Password {mode === 'edit' ? '(optional)' : ''}
          </label>
          <Input
            type="password"
            {...register('password')}
            placeholder={mode === 'edit' ? 'Leave empty to keep current' : ''}
          />
        </div>

        {mode === 'edit' && (
          <>
            <div>
              <label className={lbl}>Status</label>
              <Select {...register('status')}>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="LOCKED">Locked</option>
                <option value="DISABLED">Disabled</option>
              </Select>
            </div>

            <div>
              <label className={lbl}>Role</label>
              <Select {...register('role')}>
                {Object.values(ROLES).map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </option>
                ))}
              </Select>
            </div>

            {isStaff && (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  {...register('is_active')}
                  className="w-4 h-4 accent-mansio-ink"
                />
                <label htmlFor="is_active" className="text-sm text-mansio-mocha cursor-pointer">
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
              <Input {...register('phone_number')} placeholder="+383 44 000 000" />
            </div>

            {accountType === 'GUEST' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Address</label>
                    <Input {...register('address')} />
                  </div>
                  <div>
                    <label className={lbl}>City</label>
                    <Input {...register('city')} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Country</label>
                    <Input {...register('country')} />
                  </div>
                  <div>
                    <label className={lbl}>Date of Birth</label>
                    <Input type="date" {...register('date_of_birth')} />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Passport Number</label>
                  <Input {...register('passport_number')} />
                </div>
              </>
            )}

            {accountType === 'STAFF' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Role</label>
                  <Select {...register('role')}>
                    {STAFF_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r.charAt(0) + r.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className={lbl}>Shift</label>
                  <Select {...register('shift')}>
                    {Object.values(SHIFTS).map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </Select>
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