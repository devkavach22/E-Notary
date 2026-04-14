import Badge from '../common/Badge'
import BookingModal from '../cases/BookingModal'
import { useState } from 'react'

export default function AdvocateCard({ adv, onBook }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#351159] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
              {adv.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{adv.fullName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{adv.city}, {adv.state}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-indigo-600">₹{adv.perDocumentFee}</p>
            <p className="text-xs text-gray-400">per doc</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {adv.categories.map((cat) => (
            <Badge key={cat} label={cat} variant="indigo" />
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {adv.availableDays.join(', ')}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {adv.availableHours.from} – {adv.availableHours.to}
        </div>

        <div className="flex gap-2">
          <button onClick={() => setShowModal(true)} className="btn-primary py-2 text-sm w-auto px-4">
            Book Appointment
          </button>
          <button onClick={() => onBook(adv)} className="btn-secondary py-2 text-sm w-auto px-4">
            Templates
          </button>
        </div>
      </div>

      {showModal && (
        <BookingModal
          advocate={adv}
          onClose={() => setShowModal(false)}
          onBooked={() => {}}
        />
      )}
    </>
  )
}
