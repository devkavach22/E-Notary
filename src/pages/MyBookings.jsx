import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchMyBookings } from '../store/slices/caseSlice'
import Badge from '../components/common/Badge'
import Spinner from '../components/common/Spinner'

export default function MyBookings({ onViewBooking }) {
  const dispatch = useDispatch()
  const { bookings, bookingsStatus, bookingsError } = useSelector(s => s.case)

  useEffect(() => {
    dispatch(fetchMyBookings())
  }, [dispatch])

  const statusColor = {
    submitted: 'indigo',
    accepted: 'green',
    rejected: 'red',
    pending: 'gray',
  }

  if (bookingsStatus === 'loading') {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner />
      </div>
    )
  }

  if (bookingsStatus === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 font-semibold">Failed to load bookings</p>
        <p className="text-gray-400 text-sm mt-1">{bookingsError}</p>
        <button
          onClick={() => dispatch(fetchMyBookings())}
          className="mt-4 text-indigo-600 text-sm underline"
        >
          Retry
        </button>
      </div>
    )
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
          <div key={b.submissionId} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#351159] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {b.advocateName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{b.advocateName}</p>
                  <p className="text-xs text-gray-400">{b.advocateCity}</p>
                </div>
              </div>
              <Badge label={b.status} variant={statusColor[b.status] ?? 'gray'} />
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              <Badge label={b.practiceArea} variant="indigo" />
              <Badge label={b.category} variant="purple" />
            </div>

            <p className="text-xs text-gray-500 mb-2 truncate">{b.templateTitle}</p>

            <div className="text-xs text-gray-400 space-y-1 mb-4">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {b.dateOfSubmission}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onViewBooking && onViewBooking(b.submissionId)}
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
