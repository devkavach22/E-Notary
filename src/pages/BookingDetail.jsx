import { useSelector, useDispatch } from 'react-redux'
import { uploadDocumentForBooking } from '../store/slices/caseSlice'
import BackButton from '../components/common/BackButton'
import Badge from '../components/common/Badge'
import { toast } from 'react-toastify'

export default function BookingDetail({ bookingId, onBack, onUploadDocs }) {
  const dispatch = useDispatch()
  const booking = useSelector(s => s.case.bookings.find(b => b.id === bookingId))

  if (!booking) return (
    <div className="text-center py-20">
      <p className="text-gray-400">Booking not found.</p>
      <button onClick={onBack} className="mt-4 text-indigo-600 text-sm hover:underline">Go back</button>
    </div>
  )

  const handleUpload = (docId) => {
    dispatch(uploadDocumentForBooking({ bookingId, docId }))
    toast.success('Document uploaded successfully')
  }

  const docStatusColor = { approved: 'indigo', under_review: 'purple', pending: 'gray', rejected: 'red' }

  return (
    <div className="space-y-5 max-w-2xl">
      <BackButton onClick={onBack} label="Back to Bookings" />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-[#351159] rounded-full flex items-center justify-center text-white font-bold">
            {booking.advocateName?.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-gray-800">{booking.advocateName}</p>
            <p className="text-xs text-gray-400">{booking.advocateCity}</p>
          </div>
          <div className="ml-auto">
            <Badge label={booking.status} variant="indigo" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Case Type</p>
            <p className="font-semibold text-gray-700 mt-0.5">{booking.caseType}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Fee</p>
            <p className="font-semibold text-indigo-600 mt-0.5">Rs.{booking.fee}</p>
          </div>
        </div>
      </div>

      {booking.videoRoomUrl && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-emerald-700 text-sm">Video Consultation Ready</p>
              <p className="text-xs text-emerald-600">Your advocate has shared a meeting link</p>
            </div>
          </div>
          <a
            href={booking.videoRoomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
          >
            Join Now
          </a>
        </div>
      )}

      {booking.consultationNotes && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-semibold text-gray-800 text-sm">Consultation Notes</p>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed bg-indigo-50 rounded-xl p-3">{booking.consultationNotes}</p>
        </div>
      )}

      {booking.documentRequirements?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="font-semibold text-gray-800 text-sm">Required Documents</p>
            </div>
            <button onClick={onUploadDocs} className="text-xs text-indigo-600 font-medium hover:underline">
              Upload All
            </button>
          </div>
          <div className="space-y-2">
            {booking.documentRequirements.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${doc.uploaded ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-700 truncate">{doc.name}</span>
                  {doc.required && <span className="text-red-400 text-xs shrink-0">*</span>}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <Badge label={doc.status.replace('_', ' ')} variant={docStatusColor[doc.status] ?? 'gray'} />
                  {!doc.uploaded && (
                    <button
                      onClick={() => handleUpload(doc.id)}
                      className="text-xs bg-[#351159] text-white px-2.5 py-1 rounded-lg hover:bg-indigo-700 transition-all"
                    >
                      Upload
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
