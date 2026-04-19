import { createFileRoute, Link } from '@tanstack/react-router'
import {
  BedDouble,
  BookOpen,
  CalendarCheck,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  Users,
  XCircle,
} from 'lucide-react'
import { Container } from '../components/Container'
import { DashboardCard } from '../components/dashboard/DashboardCard'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar'
import { DataTable } from '../components/dashboard/DataTable'
import type { Column } from '../components/dashboard/DataTable'
import { OccupancyBar } from '../components/dashboard/OccupancyBar'
import { StatCard } from '../components/dashboard/StatCard'
import { StatusBadge } from '../components/dashboard/StatusBadge'
import type { BookingStatus } from '../components/dashboard/StatusBadge'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

const stats = [
  {
    label: 'Total Rooms',
    value: '48',
    icon: BedDouble,
    change: '+2 this month',
    up: true,
  },
  {
    label: 'Occupied Tonight',
    value: '36',
    icon: CalendarCheck,
    change: '75% occupancy',
    up: true,
  },
  {
    label: 'Active Bookings',
    value: '124',
    icon: BookOpen,
    change: '+8 this week',
    up: true,
  },
  {
    label: 'Revenue (MTD)',
    value: '$48,290',
    icon: DollarSign,
    change: '+12% vs last month',
    up: true,
  },
]

const recentBookings = [
  {
    id: 'BK-1042',
    guest: 'Elara Voss',
    room: 'Penthouse Suite',
    checkIn: 'Apr 18',
    checkOut: 'Apr 22',
    status: 'checked-in' as BookingStatus,
  },
  {
    id: 'BK-1041',
    guest: 'James Harlow',
    room: 'Deluxe King',
    checkIn: 'Apr 18',
    checkOut: 'Apr 19',
    status: 'pending' as BookingStatus,
  },
  {
    id: 'BK-1040',
    guest: 'Sofia Ren',
    room: 'Garden View Twin',
    checkIn: 'Apr 17',
    checkOut: 'Apr 20',
    status: 'checked-in' as BookingStatus,
  },
  {
    id: 'BK-1039',
    guest: 'Luca Marini',
    room: 'Classic Double',
    checkIn: 'Apr 16',
    checkOut: 'Apr 18',
    status: 'checked-out' as BookingStatus,
  },
  {
    id: 'BK-1038',
    guest: 'Nadia Bloom',
    room: 'Junior Suite',
    checkIn: 'Apr 19',
    checkOut: 'Apr 23',
    status: 'confirmed' as BookingStatus,
  },
]

const occupancyData = [
  { label: 'Suites', occupied: 8, total: 10 },
  { label: 'Deluxe', occupied: 14, total: 18 },
  { label: 'Classic', occupied: 14, total: 20 },
]

const quickActions = [
  { label: 'New Booking', icon: CalendarCheck },
  { label: 'Add Guest', icon: Users },
  { label: 'Add Room', icon: BedDouble },
]

const todayAlerts = [
  {
    icon: CheckCircle,
    message: '12 guests checking out today',
    color: '#4ade80',
  },
  {
    icon: Clock,
    message: '8 new arrivals expected after 3pm',
    color: 'var(--gold)',
  },
  {
    icon: XCircle,
    message: 'Room 204 — maintenance pending',
    color: '#f87171',
  },
]

type Booking = (typeof recentBookings)[number]

const bookingColumns: Column<Booking>[] = [
  {
    key: 'id',
    header: 'Booking',
    render: (b) => (
      <span className="font-medium text-xs" style={{ color: 'var(--gold-deep)' }}>
        {b.id}
      </span>
    ),
  },
  {
    key: 'guest',
    header: 'Guest',
    render: (b) => (
      <span className="text-sm" style={{ color: 'var(--text)' }}>
        {b.guest}
      </span>
    ),
  },
  {
    key: 'room',
    header: 'Room',
    render: (b) => (
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {b.room}
      </span>
    ),
  },
  {
    key: 'dates',
    header: 'Dates',
    render: (b) => (
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {b.checkIn} – {b.checkOut}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (b) => <StatusBadge status={b.status} />,
  },
]

function RouteComponent() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg)', fontFamily: 'var(--font-sans)' }}
    >
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Overview" subtitle={today} />

        <main className="flex-1 overflow-y-auto py-7">
          <Container>
            <div className="grid grid-cols-4 gap-4 mb-7">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-3 gap-5">
              {/* Recent Bookings */}
              <DataTable
                title="Recent Bookings"
                columns={bookingColumns}
                rows={recentBookings}
                getRowKey={(b) => b.id}
                viewAllTo="/bookings"
                className="col-span-2"
              />

              {/* Right column */}
              <div className="flex flex-col gap-5">
                {/* Occupancy */}
                <DashboardCard className="p-5">
                  <h2
                    className="font-serif text-base mb-4"
                    style={{ color: 'var(--text)' }}
                  >
                    Occupancy
                  </h2>
                  <div className="space-y-3.5">
                    {occupancyData.map((item) => (
                      <OccupancyBar key={item.label} {...item} />
                    ))}
                  </div>
                </DashboardCard>

                {/* Quick Actions */}
                <DashboardCard className="p-5">
                  <h2
                    className="font-serif text-base mb-4"
                    style={{ color: 'var(--text)' }}
                  >
                    Quick Actions
                  </h2>
                  <div className="space-y-2">
                    {quickActions.map(({ label, icon: Icon }) => (
                      <button
                        key={label}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-left transition-all duration-200 hover:opacity-80 border"
                        style={{
                          backgroundColor: 'var(--ivory)',
                          borderColor: 'var(--border)',
                          color: 'var(--text)',
                        }}
                      >
                        <Icon size={13} style={{ color: 'var(--gold-deep)' }} />
                        {label}
                        <ChevronRight
                          size={12}
                          className="ml-auto"
                          style={{ color: 'var(--text-muted)' }}
                        />
                      </button>
                    ))}
                  </div>
                </DashboardCard>

                <DashboardCard className="p-5" dark>
                  <h2
                    className="font-serif text-base mb-4"
                    style={{ color: 'var(--color-mansio-cream)' }}
                  >
                    Today's Alerts
                  </h2>
                  <div className="space-y-3">
                    {todayAlerts.map(({ icon: Icon, message, color }) => (
                      <div key={message} className="flex items-start gap-2.5">
                        <Icon
                          size={13}
                          className="mt-0.5 shrink-0"
                          style={{ color }}
                        />
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: 'rgba(212,196,168,0.8)' }}
                        >
                          {message}
                        </p>
                      </div>
                    ))}
                  </div>
                </DashboardCard>
              </div>
            </div>
          </Container>
        </main>
      </div>
    </div>
  )
}
