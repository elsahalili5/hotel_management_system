import { formatDate } from "#/lib/dates"
import { getUserFullName, getUserInitials } from "#/lib/helpers"
import { Button } from "../Button"
import type { AuthUser } from "@mansio/shared"

interface ProfileHeaderProps {
  user: AuthUser
  onLogout: () => void
}

export function ProfileHeader({
  user,
  onLogout,
}: ProfileHeaderProps) {
  return (
    <div className="bg-mansio-espresso py-16 px-6">
      <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-8">

        <div className="w-24 h-24 rounded-full border-2 border-mansio-gold bg-mansio-gold/10 flex items-center justify-center shrink-0">
          <span className="font-serif text-3xl text-mansio-gold">{getUserInitials(user)}</span>
        </div>

        <div className="text-center md:text-left flex-1">
          <p className="text-xs tracking-widest uppercase mb-2 text-mansio-gold">Guest Profile</p>
          <h1 className="font-serif text-4xl md:text-5xl text-mansio-cream mb-2">
            {getUserFullName(user)}
          </h1>
          <p className="text-mansio-taupe font-light">{user.email}</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
          <span className="px-3 py-1 text-xs tracking-widest uppercase bg-mansio-gold/15 text-mansio-gold border border-mansio-gold/25">
            {user.status}
          </span>
          <p className="text-xs text-mansio-taupe tracking-wide">Member since {formatDate(user.created_at)}</p>

          <Button onClick={onLogout} variant="primary" >
            Logout
          </Button>
        </div>

      </div>
    </div>
  )
}
