import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { DashboardCard } from './DashboardCard'
import type { FileRoutesByTo } from '#/routeTree.gen'

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
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  viewAllTo?: keyof FileRoutesByTo
}

export function DataTable<T>({ title, columns, rows, getRowKey, onEdit, onDelete, viewAllTo }: DataTableProps<T>) {
  return (
    <DashboardCard className="overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-mansio-ink/10">
        <h2 className="font-serif text-base text-mansio-ink">{title}</h2>
        {viewAllTo && (
          <Link to={viewAllTo} className="text-xs tracking-widest uppercase text-mansio-gold hover:opacity-70 transition-opacity">
            View all →
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-center py-10 text-mansio-mocha">No records found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-mansio-ink/10">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3 text-left text-xs tracking-widest uppercase font-medium text-mansio-mocha">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-6 py-3" />}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={getRowKey(row)} className={i < rows.length - 1 ? 'border-b border-mansio-ink/10' : ''}>
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-3.5">{col.render(row)}</td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      {onEdit && (
                        <button className="p-1.5 rounded hover:opacity-70 transition-opacity text-mansio-mocha" onClick={() => onEdit(row)}>
                          <Pencil size={14} />
                        </button>
                      )}
                      {onDelete && (
                        <button className="p-1.5 rounded hover:opacity-70 transition-opacity text-red-400" onClick={() => onDelete(row)}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardCard>
  )
}