const statusConfig = {
  'checked-in': {
    label: 'Checked In',
    textColor: '#166534',
    bgColor: '#f0fdf4',
    dotColor: '#22c55e',
  },
  'checked-out': {
    label: 'Checked Out',
    textColor: '#6b5744',
    bgColor: '#ede5d4',
    dotColor: '#9c8d7a',
  },
  pending: {
    label: 'Pending',
    textColor: '#92400e',
    bgColor: '#fffbeb',
    dotColor: '#f59e0b',
  },
  confirmed: {
    label: 'Confirmed',
    textColor: '#1e40af',
    bgColor: '#eff6ff',
    dotColor: '#3b82f6',
  },
}

export type BookingStatus = keyof typeof statusConfig

interface StatusBadgeProps {
  status: BookingStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, textColor, bgColor, dotColor } = statusConfig[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
      {label}
    </span>
  )
}
