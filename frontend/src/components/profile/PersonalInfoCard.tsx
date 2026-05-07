import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Phone, Calendar, MapPin, Globe, Edit3, X, FileText } from 'lucide-react'
import { Button } from '../Button'
import type { AuthUser } from '@mansio/shared'
import { formatDate } from '#/lib/dates'
import { useUpdateGuest } from '#/modules/guest/hooks/use-guests'
import { useAuth } from '#/modules/auth/hooks/use-auth'

const inputClass =
  'w-full bg-white border border-mansio-linen/60 rounded-sm px-4 py-3 text-sm text-mansio-espresso placeholder-mansio-linen focus:outline-none focus:border-mansio-gold transition-colors'
const labelClass =
  'text-xs font-medium tracking-widest uppercase text-mansio-taupe mb-1.5 block'

type EditForm = {
  phone_number: string
  date_of_birth: string
  address: string
  city: string
  country: string
  passport_number: string
}

interface PersonalInfoCardProps {
  user: AuthUser
}

export function PersonalInfoCard({ user }: PersonalInfoCardProps) {
  const [editing, setEditing] = useState(false)
  const updateGuest = useUpdateGuest()
  const { refreshUser } = useAuth()

  const { register, handleSubmit } = useForm<EditForm>({
    defaultValues: {
      phone_number: user.guest_profile?.phone_number ?? '',
      date_of_birth: user.guest_profile?.date_of_birth
        ? new Date(user.guest_profile.date_of_birth).toISOString().split('T')[0]
        : '',
      address: user.guest_profile?.address ?? '',
      city: user.guest_profile?.city ?? '',
      country: user.guest_profile?.country ?? '',
      passport_number: user.guest_profile?.passport_number ?? '',
    },
  })

  async function onSubmit(values: EditForm) {
    if (!user.guest_profile?.id) return
    await updateGuest.mutateAsync({
      id: user.guest_profile.id,
      data: {
        phone_number: values.phone_number || undefined,
        date_of_birth: values.date_of_birth ? new Date(values.date_of_birth) : undefined,
        address: values.address || undefined,
        city: values.city || undefined,
        country: values.country || undefined,
        passport_number: values.passport_number || undefined,
      },
    })
    await refreshUser()
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="bg-mansio-ivory p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase mb-1 text-mansio-gold">Profile</p>
            <h2 className="font-serif text-2xl text-mansio-espresso">Edit Information</h2>
          </div>
          <Button isIcon variant="ghost" aria-label="Cancel" onClick={() => setEditing(false)}>
            <X size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Phone Number</label>
              <input type="tel" {...register('phone_number')} className={inputClass} placeholder="+383 44 000 000" />
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input type="date" {...register('date_of_birth')} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Address</label>
              <input type="text" {...register('address')} className={inputClass} placeholder="Street address" />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input type="text" {...register('city')} className={inputClass} placeholder="City" />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input type="text" {...register('country')} className={inputClass} placeholder="Country" />
            </div>
            <div>
              <label className={labelClass}>Passport Number</label>
              <input type="text" {...register('passport_number')} className={inputClass} placeholder="XK000000" />
            </div>
          </div>
          <div className="pt-4 flex justify-center">
            <Button type="submit" disabled={updateGuest.isPending}>
              {updateGuest.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-mansio-ivory p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs tracking-widest uppercase mb-1 text-mansio-gold">Profile</p>
          <h2 className="font-serif text-2xl text-mansio-espresso">Personal Information</h2>
        </div>
        <Button variant="ghost" startIcon={<Edit3 size={13} />} onClick={() => setEditing(true)}>
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {[
          { Icon: Phone, label: 'Phone Number', value: user.guest_profile?.phone_number },
          { Icon: Calendar, label: 'Date of Birth', value: formatDate(user.guest_profile?.date_of_birth) },
          { Icon: MapPin, label: 'Address', value: user.guest_profile?.address },
          { Icon: MapPin, label: 'City', value: user.guest_profile?.city },
          { Icon: Globe, label: 'Country', value: user.guest_profile?.country },
          { Icon: FileText, label: 'Passport Number', value: user.guest_profile?.passport_number },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Icon size={12} className="text-mansio-gold" />
              <span className="text-xs tracking-widest uppercase text-mansio-taupe">{label}</span>
            </div>
            <p className="text-sm font-medium text-mansio-espresso pl-5">
              {value ?? <span className="text-mansio-taupe font-light italic">Not provided</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
