import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { uploadDocumentForBooking } from '../store/slices/caseSlice'
import BackButton from '../components/common/BackButton'
import { toast } from 'react-toastify'

export default function UploadCaseDocs({ bookingId, onBack }) {
  const dispatch = useDispatch()
  const booking = useSelector(s => s.case.bookings.find(b => b.id === bookingId))
  const [dragOver, setDragOver] = useState(null)
  const [files, setFiles] = useState({})

  if (!booking) return (
    <div className="text-center py-20">
      <p className="text-gray-400">Booking not found.</p>
      <button onClick={onBack} className="mt-4 text-indigo-600 text-sm hover:underline">Go back</button>
    </div>
  )

  const handleFile = (docId, file) => {
    if (!file) return
    setFiles(prev => ({ ...prev, [docId]: file }))
  }

  const handleUpload = (docId) => {
    if (!files[docId]) { toast.error('Please select a file first'); return }
    dispatch(uploadDocumentForBooking({ bookingId, docId }))
    toast.success('Document uploaded successfully')
    setFiles(prev => { const n = { ...prev }; delete n[docId]; return n })
  }

  const docStatusBg = { approved: 'bg-emerald-50 border-emerald-200', under_review: 'bg-purple-50 border-purple-200', pending: 'bg-gray-50 border-gray-200', rejected: 'bg-red-50 border-red-200' }
  const docStatusText = { approved: 'text-emerald-600', under_review: 'text-purple-600', pending: 'text-gray-500', rejected: 'text-red-500' }

  return (
    <div className="space-y-5 max-w-2xl">
      <BackButton onClick={onBack} label="Back to Booking" />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="font-semibold text-gray-800 text-sm">Upload Documents</p>
        <p className="text-xs text-gray-400 mt-0.5">For: {booking.advocateName} · {booking.caseType}</p>
      </div>

      {booking.documentRequirements?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mb-3">📋</div>
          <p className="text-gray-600 font-semibold text-sm">No documents required yet</p>
          <p className="text-gray-400 text-xs mt-1">Your advocate will send document requirements after consultation</p>
        </div>
      )}

      <div className="space-y-3">
        {booking.documentRequirements?.map(doc => (
          <div key={doc.id} className={`rounded-2xl border p-4 ${docStatusBg[doc.status] ?? 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {doc.name}
                  {doc.required && <span className="text-red-400 ml-1">*</span>}
                </p>
                <p className={`text-xs font-medium mt-0.5 capitalize ${docStatusText[doc.status]}`}>
                  {doc.status.replace('_', ' ')}
                </p>
              </div>
              {doc.uploaded && (
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {!doc.uploaded && (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(doc.id) }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => { e.preventDefault(); setDragOver(null); handleFile(doc.id, e.dataTransfer.files[0]) }}
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${dragOver === doc.id ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-white'}`}
              >
                <input
                  type="file"
                  id={`file-${doc.id}`}
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={e => handleFile(doc.id, e.target.files[0])}
                />
                {files[doc.id] ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-indigo-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium truncate max-w-[200px]">{files[doc.id].name}</span>
                  </div>
                ) : (
                  <div>
                    <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs text-gray-400">Drag & drop or <label htmlFor={`file-${doc.id}`} className="text-indigo-600 cursor-pointer font-medium hover:underline">browse</label></p>
                    <p className="text-xs text-gray-300 mt-0.5">PDF, JPG, PNG up to 10MB</p>
                  </div>
                )}
              </div>
            )}

            {!doc.uploaded && (
              <button
                onClick={() => handleUpload(doc.id)}
                disabled={!files[doc.id]}
                className="mt-3 btn-primary py-2 text-sm w-auto px-4 disabled:opacity-40"
              >
                Upload Document
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
