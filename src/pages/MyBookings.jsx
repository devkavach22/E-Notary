import { useSelector, useDispatch } from 'react-redux'
import { setSelectedBooking } from '../store/slices/caseSlice'
import Badge from '../components/common/Badge'

export default function MyBookings({ onViewBooking }) {
  const bookings = useSelector(s => s.case.bookings)

  const statusColor = {
    confirmed: 'indigo',
    pending: 'gray',
    cancelled: 'red',
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-gray-800">My Bookings</p>
          <p className="text-xs text-gray-400 mt-0.5">{bookings.length} appointment(s)</p>
        </div>
      </div>

      {bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mb-4">📅</div>
          <p className="text-gray-700 font-semibold">No bookings yet</p>
          <p className="text-gray-400 text-sm mt-1">Book an advocate to get started</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {bookings.map(b => (
          <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#351159] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {b.advocateName?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{b.advocateName}</p>
                  <p className="text-xs text-gray-400">{b.advocateCity}</p>
                </div>
              </div>
              <Badge label={b.status} variant={statusColor[b.status] ?? 'gray'} />
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              <Badge label={b.caseType} variant="indigo" />
              <Badge label={b.category} variant="purple" />
            </div>

            <div className="text-xs text-gray-400 space-y-1 mb-4">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(b.bookedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {b.selectedDay && ` · ${b.selectedDay}`}
                {b.selectedTime && ` at ${b.selectedTime}`}
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ₹{b.fee} consultation fee
              </div>
            </div>

            <div className="flex gap-2">
              {b.videoRoomUrl && (
                <a
                  href={b.videoRoomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-medium px-3 py-2 rounded-xl transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Join Call
                </a>
              )}
              <button
                onClick={() => onViewBooking(b.id)}
                className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-medium px-3 py-2 rounded-xl transition-all"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
