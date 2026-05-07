import type { ReactNode } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
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
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
}

export function DataTable<T>({ title, columns, rows, getRowKey, onEdit, onDelete }: DataTableProps<T>) {
  return (
    <DashboardCard>
      <div className="px-6 py-4 border-b border-mansio-ink/10">
        <h2 className="font-serif text-base text-mansio-ink">{title}</h2>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-center py-10 text-mansio-mocha">No records found.</p>
      ) : (
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="border-b border-mansio-ink/10">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs tracking-widest uppercase font-medium text-mansio-mocha truncate">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="w-16 px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={getRowKey(row)} className={i < rows.length - 1 ? 'border-b border-mansio-ink/10' : ''}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 truncate max-w-0">{col.render(row)}</td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3.5 w-16">
                    <div className="flex items-center gap-1 justify-end">
                      {onEdit && (
                        <button onClick={() => onEdit(row)} className="p-1.5 rounded hover:opacity-70 transition-opacity text-mansio-mocha">
                          <Pencil size={14} />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(row)} className="p-1.5 rounded hover:opacity-70 transition-opacity text-red-400">
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