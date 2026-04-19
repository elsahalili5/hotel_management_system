import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { DashboardCard } from './DashboardCard'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
}

interface DataTableProps<T> {
  title: string
  columns: Column<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  viewAllTo?: '/bookings' | '/rooms' | '/dashboard'
  className?: string
}

export function DataTable<T>({
  title,
  columns,
  rows,
  getRowKey,
  viewAllTo,
  className = '',
}: DataTableProps<T>) {
  return (
    <DashboardCard className={`overflow-hidden ${className}`}>
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <h2 className="font-serif text-base" style={{ color: 'var(--text)' }}>
          {title}
        </h2>
        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="text-xs tracking-widest uppercase hover:opacity-70 transition-opacity"
            style={{ color: 'var(--gold-deep)' }}
          >
            View all →
          </Link>
        )}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs tracking-widest uppercase font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={getRowKey(row)}
              style={{
                borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-3.5">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardCard>
  )
}
