interface OccupancyBarProps {
  label: string
  occupied: number
  total: number
}

export function OccupancyBar({ label, occupied, total }: OccupancyBarProps) {
  const percentage = Math.round((occupied / total) * 100)
  return (
    <div>
      <div
        className="flex justify-between text-xs mb-1.5"
        style={{ color: 'var(--text-muted)' }}
      >
        <span>{label}</span>
        <span>
          {occupied}/{total}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--ivory)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: 'var(--gold)' }}
        />
      </div>
    </div>
  )
}
