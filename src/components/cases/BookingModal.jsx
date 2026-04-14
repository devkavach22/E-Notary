import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addBooking } from '../../store/slices/caseSlice'
import { toast } from 'react-toastify'

export default function BookingModal({ advocate, onClose, onBooked }) {
  const dispatch = useDispatch()
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [note, setNote] = useState('')

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']

  const handleBook = () => {
    if (!selectedDay || !selectedTime) {
      toast.error('Please select a day and time slot')
      return
    }
    const booking = {
      id: `BK${Date.now()}`,
      advocateId: advocate._id,
      advocateName: advocate.fullName,
      advocateCity: `${advocate.city}, ${advocate.state}`,
      caseType: advocate.categories?.[0] ?? '',
      category: advocate.categories?.[0] ?? '',
      fee: advocate.perDocumentFee,
      bookedAt: new Date().toISOString(),
      status: 'confirmed',
      videoRoomUrl: null,
      consultationNotes: null,
      documentRequirements: [],
      selectedDay,
      selectedTime,
      note,
    }
    dispatch(addBooking(booking))
    toast.success(`Appointment booked with ${advocate.fullName}`)
    onBooked?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-[#351159] rounded-t-2xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-white font-bold">Book Appointment</p>
            <p className="text-indigo-200 text-xs mt-0.5">{advocate.fullName}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-indigo-50 rounded-xl p-3 flex items-center justify-between text-sm">
            <span className="text-gray-600">Consultation Fee</span>
            <span className="font-bold text-indigo-600">₹{advocate.perDocumentFee}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Day</label>
            <div className="flex flex-wrap gap-2">
              {advocate.availableDays?.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedDay === day ? 'bg-[#351159] text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Time Slot</label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedTime === t ? 'bg-[#351159] text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Note (optional)</label>
            <textarea
              rows={2}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Briefly describe your case..."
              className="input-field resize-none text-sm"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="btn-secondary py-2.5 text-sm">Cancel</button>
            <button onClick={handleBook} className="btn-primary py-2.5 text-sm">Confirm Booking</button>
          </div>
        </div>
      </div>
    </div>
  )
}
