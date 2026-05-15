import { createFileRoute } from '@tanstack/react-router'
import { requireRole } from '#/lib/route-guard'
import { ROLES } from '@mansio/shared'
import { useState } from 'react'
import { CalendarCheck, LogOut, List } from 'lucide-react'
import { DataTable } from '#/modules/admin/components/DataTable'
import { Button } from '#/components/Button'
import type { Column } from '#/modules/admin/components/DataTable'
import type { ReservationResponse } from '@mansio/shared'
import {
  useReservations,
  useTodaysCheckIns,
  useTodaysCheckOuts,
} from '#/modules/reservation/hooks/use-reservations'
import { ReservationModal } from '#/modules/reservation/components/ReservationModal'

export const Route = createFileRoute('/dashboard/reservations')({
  beforeLoad: ({ context }) => {
    requireRole(context.auth, {
      role: [ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST],
      redirectTo: '/dashboard',
    })
  },
  component: ReservationsPage,
})

type Tab = 'arrivals' | 'departures' | 'all'

const statusColors: Record<string, string> = {
  CONFIRMED:   'bg-blue-100 text-blue-700',
  CHECKED_IN:  'bg-green-100 text-green-700',
  CHECKED_OUT: 'bg-mansio-ink/10 text-mansio-mocha',
  CANCELLED:   'bg-red-100 text-red-500',
  NO_SHOW:     'bg-amber-100 text-amber-700',
}

const fmt = (d: string | Date) => new Date(d).toLocaleDateString('en-GB')

function ReservationsPage() {
  const [tab, setTab] = useState<Tab>('arrivals')
  const [selected, setSelected] = useState<ReservationResponse | null>(null)

  const { data: allReservations,       isLoading: loadingAll }        = useReservations()
  const { data: arrivalReservations,   isLoading: loadingArrivals }   = useTodaysCheckIns()
  const { data: departureReservations, isLoading: loadingDepartures } = useTodaysCheckOuts()

  const rows =
    tab === 'arrivals'   ? (arrivalReservations   ?? []) :
    tab === 'departures' ? (departureReservations ?? []) :
                           (allReservations        ?? [])

  const isLoading =
    tab === 'arrivals'   ? loadingArrivals :
    tab === 'departures' ? loadingDepartures :
                           loadingAll

  const tableTitle =
    tab === 'arrivals'   ? "Today's Arrivals" :
    tab === 'departures' ? "Today's Departures" :
                           'All Reservations'

  const columns: Column<ReservationResponse>[] = [
    {
      key: 'guest',
      header: 'Guest',
      render: (r) => (
        <div>
          <p className="text-sm font-medium text-mansio-ink">
            {r.guest.user.first_name} {r.guest.user.last_name}
          </p>
          <p className="text-xs text-mansio-mocha">{r.guest.user.email}</p>
        </div>
      ),
    },
    {
      key: 'room',
      header: 'Room',
      render: (r) => (
        <div>
          <p className="text-sm font-medium text-mansio-ink">#{r.room.room_number}</p>
          <p className="text-xs text-mansio-mocha">{r.room.room_type.name}</p>
        </div>
      ),
    },
    {
      key: 'check_in_date',
      header: 'Check In',
      render: (r) => <span className="text-sm text-mansio-mocha">{fmt(r.check_in_date)}</span>,
    },
    {
      key: 'check_out_date',
      header: 'Check Out',
      render: (r) => <span className="text-sm text-mansio-mocha">{fmt(r.check_out_date)}</span>,
    },
    {
      key: 'guests',
      header: 'Guests',
      render: (r) => (
        <span className="text-sm text-mansio-mocha">
          {r.adults}A{r.children > 0 ? ` / ${r.children}C` : ''}
        </span>
      ),
    },
    {
      key: 'invoice',
      header: 'Total',
      render: (r) => {
        if (!r.invoice) return <span className="text-xs text-mansio-mocha">—</span>
        const total = r.invoice.items.reduce((s, i) => s + Number(i.total), 0)
        return <span className="text-sm font-medium text-mansio-ink">€{total.toFixed(2)}</span>
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[r.status] ?? 'bg-mansio-ink/10 text-mansio-mocha'}`}>
          {r.status.replace('_', ' ')}
        </span>
      ),
    },
  ]

  return (
    <>
      <div className="flex gap-2 mb-6">
        <Button
          variant={tab === 'arrivals' ? 'primary' : 'outline'}
          startIcon={<CalendarCheck size={14} />}
          onClick={() => setTab('arrivals')}
        >
          Today's Arrivals
        </Button>
        <Button
          variant={tab === 'departures' ? 'primary' : 'outline'}
          startIcon={<LogOut size={14} />}
          onClick={() => setTab('departures')}
        >
          Today's Departures
        </Button>
        <Button
          variant={tab === 'all' ? 'primary' : 'outline'}
          startIcon={<List size={14} />}
          onClick={() => setTab('all')}
        >
          All Reservations
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-center py-10 text-mansio-mocha">Loading...</p>
      )}

      {!isLoading && (
        <DataTable
          title={tableTitle}
          columns={columns}
          rows={rows}
          getRowKey={(r) => String(r.id)}
          onRowClick={(r) => setSelected(r)}
        />
      )}

      {selected && (
        <ReservationModal
          reservation={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}