import { useState } from 'react'
import { Phone, Calendar, MapPin, Globe, Edit3, X } from 'lucide-react'
import { Button } from '../Button'
import { FormSection } from '../Form'
import type { FieldDef } from '../Form'
import type { AuthUser } from '@mansio/shared'
import { formatDate } from '#/lib/dates'

const profileFields: FieldDef[] = [
  { name: 'phone_number', label: 'Phone Number', type: 'tel', placeholder: '+383 44 000 000' },
  { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
  { name: 'address', label: 'Address', type: 'text', placeholder: 'Street address', colSpan: 'full' },
  { name: 'city', label: 'City', type: 'text', placeholder: 'City' },
  { name: 'country', label: 'Country', type: 'text', placeholder: 'Country' },
  { name: 'passport_number', label: 'Passport Number', type: 'text', placeholder: 'XK000000' },
]

 

interface PersonalInfoCardProps {
  user: AuthUser
}

 

export function PersonalInfoCard({ user }: PersonalInfoCardProps) {
  const [editing, setEditing] = useState(false)

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

        <FormSection
          inline
          fields={profileFields}
          submitLabel="Save Changes"
          successTitle="Profile Updated"
          successMessage="Your information has been saved successfully."
          onSubmit={async () => setEditing(false)}
        />
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
