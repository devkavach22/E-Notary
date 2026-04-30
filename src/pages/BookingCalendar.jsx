import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

function formatTime(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function toDateKey(isoString) {
  if (!isoString) return null
  const d = new Date(isoString)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

const statusMeta = {
  confirmed: { color: 'bg-green-500', light: 'bg-green-50 border-green-200', text: 'text-green-700', dot: 'bg-green-500', label: 'Confirmed' },
  pending:   { color: 'bg-yellow-400', light: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-400', label: 'Pending' },
  rejected:  { color: 'bg-red-400', light: 'bg-red-50 border-red-200', text: 'text-red-600', dot: 'bg-red-400', label: 'Rejected' },
  submitted: { color: 'bg-indigo-500', light: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-500', label: 'Submitted' },
  accepted:  { color: 'bg-teal-500', light: 'bg-teal-50 border-teal-200', text: 'text-teal-700', dot: 'bg-teal-500', label: 'Accepted' },
}

export default function BookingCalendar() {
  const { bookings } = useSelector(s => s.case)
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(null) // { year, month, date }

  // Build a map: dateKey -> [bookings]
  const bookingMap = useMemo(() => {
    const map = {}
    bookings.forEach(b => {
      const raw = b.bookedAt || b.dateOfSubmission || b.createdAt
      const key = toDateKey(raw)
      if (!key) return
      if (!map[key]) map[key] = []
      map[key].push(b)
    })
    return map
  }, [bookings])

  // Calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
    setSelectedDay(null)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
    setSelectedDay(null)
  }

  const selectedKey = selectedDay
    ? `${selectedDay.year}-${selectedDay.month}-${selectedDay.date}`
    : null
  const selectedBookings = selectedKey ? (bookingMap[selectedKey] || []) : []

  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

  // Stats for current month
  const bookedDaysThisMonth = Object.keys(bookingMap).filter(k => {
    const [y, m] = k.split('-').map(Number)
    return y === viewYear && m === viewMonth
  }).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-lg font-bold text-gray-800">Meeting Calendar</p>
        <p className="text-xs text-gray-400 mt-0.5">View your scheduled meetings and free days</p>
      </div>

      {/* Legend + Stats */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-full bg-[#351159] inline-block" />
          Booked
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300 inline-block" />
          Free
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-full bg-indigo-200 inline-block" />
          Today
        </div>
        <div className="ml-auto text-xs text-gray-400">
          <span className="font-semibold text-[#351159]">{bookedDaysThisMonth}</span> booked day{bookedDaysThisMonth !== 1 ? 's' : ''} this month
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Calendar */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <p className="font-bold text-gray-800 text-base">{MONTHS[viewMonth]} {viewYear}</p>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* Date cells */}
          <div classNa