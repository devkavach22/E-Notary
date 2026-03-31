import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { uploadDocuments, resetUploadDocs } from '../store/slices/authSlice'
import AuthLayout from '../components/AuthLayout'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
const MAX_SIZE_MB = 5

function validateFile(file, label) {
  if (!file) return `${label} is required`
  if (!ALLOWED_TYPES.includes(file.type)) return `${label}: only JPG, PNG or PDF allowed`
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return `${label}: file must be under ${MAX_SIZE_MB}MB`
  return ''
}

function UploadBox({ label, hint, file, error, onChange, accept }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
        ${file && !error ? 'border-green-400 bg-green-50' : error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'}`}>

        {file ? (
          <div className="text-center px-4">
            {/* Preview for images */}
            {file.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="h-16 w-auto mx-auto mb-2 rounded-lg object-cover shadow"
              />
            ) : (
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            )}
            <p className="text-sm font-medium text-green-700 truncate max-w-[200px]">{file.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
          </div>
        ) : (
          <div className="text-center px-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${error ? 'bg-red-100' : 'bg-gray-100'}`}>
              <svg className={`w-6 h-6 ${error ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
              </svg>
            </div>
            <p className={`text-sm font-medium ${error ? 'text-red-500' : 'text-gray-600'}`}>Click to upload {label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
          </div>
        )}
        <input type="file" accept={accept} className="hidden" onChange={onChange} />
      </label>

      {error && (
        <p className="error-msg mt-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {error}
        </p>
      )}
    </div>
  )
}

export default function UploadDocuments() {
  const [aadhaar, setAadhaar] = useState(null)
  const [pan, setPan] = useState(null)
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { uploadDocsStatus } = useSelector((s) => s.auth)
  const loading = uploadDocsStatus === 'loading'

  useEffect(() => {
    if (uploadDocsStatus === 'succeeded') {
      dispatch(resetUploadDocs())
      navigate('/register')
    }
  }, [uploadDocsStatus])

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {
      aadhaar: validateFile(aadhaar, 'Aadhaar Card'),
      pan: validateFile(pan, 'PAN Card'),
    }
    if (errs.aadhaar || errs.pan) { setErrors(errs); return }
    setErrors({})
    dispatch(uploadDocuments({ aadhaarFront: aadhaar, panCard: pan }))
  }

  const handleAadhaar = (e) => {
    const file = e.target.files[0]
    setAadhaar(file)
    setErrors(prev => ({ ...prev, aadhaar: validateFile(file, 'Aadhaar Card') }))
  }

  const handlePan = (e) => {
    const file = e.target.files[0]
    setPan(file)
    setErrors(prev => ({ ...prev, pan: validateFile(file, 'PAN Card') }))
  }

  return (
    <AuthLayout step={4} totalSteps={5} title="Upload Documents" subtitle="Upload your Aadhaar and PAN card for KYC verification.">
      <form onSubmit={handleSubmit} className="space-y-5">

        <UploadBox
          label="Aadhaar Card (Front)"
          hint="JPG, PNG or PDF · Max 5MB"
          file={aadhaar}
          error={errors.aadhaar}
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleAadhaar}
        />

        <UploadBox
          label="PAN Card"
          hint="JPG, PNG or PDF · Max 5MB"
          file={pan}
          error={errors.pan}
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handlePan}
        />

        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-amber-700">
            Ensure documents are clear and readable. Your details will be auto-fetched after upload.
          </p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Uploading...
            </>
          ) : 'Upload & Continue'}
        </button>
      </form>
    </AuthLayout>
  )
}
