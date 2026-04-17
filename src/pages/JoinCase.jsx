import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { submitCoApplicantForm } from '../store/slices/caseSlice'
import { toast } from 'react-toastify'

const CO_APPLICANT_FIELDS = [
  { name: 'Full Name',        type: 'text',     required: true  },
  { name: 'Date of Birth',    type: 'date',     required: true  },
  { name: 'Aadhaar Number',   type: 'text',     required: true  },
  { name: 'PAN Number',       type: 'text',     required: true  },
  { name: 'Address',          type: 'textarea', required: true  },
  { name: 'Mobile Number',    type: 'text',     required: true  },
  { name: 'Email',            type: 'email',    required: false },
  { name: 'Relationship',     type: 'select',   required: true,
    options: ['Spouse', 'Parent', 'Sibling', 'Business Partner', 'Buyer', 'Seller', 'Other'] },
]

export default function JoinCase() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = searchParams.get('token')

  const cases = useSelector(s => s.case.cases)
  const authToken = useSelector(s => s.auth.token)
  const isLoggedIn = !!authToken

  const [caseData, setCaseData]   = useState(null)
  const [copData, setCopData]     = useState(null)
  const [values, setValues]       = useState({})
  const [errors, setErrors]       = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [expired, setExpired]     = useState(false)

  useEffect(() => {
    if (!token) { setExpired(true); return }
    for (const c of cases) {
      const cop = c.coApplicants?.find(p => p.token === token)
      if (cop) {
        if (cop.invitedAt) {
          const diff = Date.now() - new Date(cop.invitedAt).getTime()
          if (diff > 48 * 60 * 60 * 1000) { setExpired(true); return }
        }
        if (cop.status === 'submitted') { setSubmitted(true) }
        setCaseData(c)
        setCopData(cop)
        setValues(cop.fields ?? {})
        return
      }
    }
    setExpired(true)
  }, [token, cases])

  const handleChange = (name, val) => {
    setValues(prev => ({ ...prev, [name]: val }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    CO_APPLICANT_FIELDS.forEach(f => {
      if (f.required && !values[f.name]?.toString().trim()) errs[f.name] = `${f.name} is required`
    })
    if (Object.keys(errs).length) { setErrors(errs); return }
    dispatch(submitCoApplicantForm({ token, fields: values }))
    setSubmitted(true)
    toast.success('Your details have been submitted successfully')
  }

  // ── Invalid / expired token ──
  if (expired) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">⏰</div>
        <p className="font-bold text-gray-800 text-lg">Link Expired or Invalid</p>
        <p className="text-gray-400 text-sm mt-2">This invite link is no longer valid. Please ask the case owner to send a new invite.</p>
        <button onClick={() => navigate('/login')} className="mt-6 btn-primary py-2.5 text-sm w-auto px-6">
          Go to Login
        </button>
      </div>
    </div>
  )

  // ── Loading ──
  if (!caseData || !copData) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // ── Not logged in → show auth gate ──
  if (!isLoggedIn) return (
    <AuthGate token={token} caseData={caseData} copData={copData} navigate={navigate} />
  )

  // ── Already submitted ──
  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
        <p className="font-bold text-gray-800 text-lg">Details Submitted</p>
        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
          Your details have been submitted for <span className="font-semibold text-indigo-600">{caseData.title}</span>.
          The case owner will be notified.
        </p>
        <div className="mt-4 bg-indigo-50 rounded-xl p-3 text-xs text-indigo-700">
          Case: {caseData.id} · Role: {copData.role}
        </div>
        <button
          onClick={() => navigate('/dashboard?nav=invited-cases')}
          className="mt-4 btn-primary py-2.5 text-sm w-auto px-6"
        >
          View My Invited Cases
        </button>
      </div>
    </div>
  )

  // ── Main form ──
  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-lg mx-auto space-y-5">

        <LogoHeader />

        {/* Case info banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white">
          <p className="text-xs text-indigo-200 mb-1">You have been invited as</p>
          <p className="font-bold text-lg">{copData.role}</p>
          <p className="text-indigo-200 text-sm mt-0.5">{caseData.title}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-indigo-200">
            <span>Case: {caseData.id}</span>
            <span>·</span>
            <span>{caseData.advocateName}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Please fill your personal details accurately. This information will be used in the notarized document.</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-semibold text-gray-800 mb-4">Your Details</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {CO_APPLICANT_FIELDS.map(f => {
              const val = values[f.name] ?? ''
              const err = errors[f.name]
              return (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {f.name}
                    {f.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea rows={3} value={val} onChange={e => handleChange(f.name, e.target.value)}
                      placeholder={f.name} className={`input-field resize-none ${err ? 'input-error' : ''}`} />
                  ) : f.type === 'select' ? (
                    <select value={val} onChange={e => handleChange(f.name, e.target.value)}
                      className={`input-field ${err ? 'input-error' : ''}`}>
                      <option value="">Select {f.name}</option>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={val} onChange={e => handleChange(f.name, e.target.value)}
                      placeholder={f.name} className={`input-field ${err ? 'input-error' : ''}`} />
                  )}
                  {err && (
                    <p className="error-msg mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {err}
                    </p>
                  )}
                </div>
              )
            })}
            <button type="submit" className="btn-primary py-3 text-sm mt-2 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Submit My Details
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 pb-6">
          Your data is encrypted and used only for this notarization case.
        </p>
      </div>
    </div>
  )
}

// ── Auth Gate shown to unauthenticated second party ──
function AuthGate({ token, caseData, copData, navigate }) {
  const redirectUrl = `/join-case?token=${token}`

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto space-y-5">
        <LogoHeader />

        {/* Case info banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white">
          <p className="text-xs text-indigo-200 mb-1">You have been invited as</p>
          <p className="font-bold text-lg">{copData.role}</p>
          <p className="text-indigo-200 text-sm mt-0.5">{caseData.title}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-indigo-200">
            <span>Case: {caseData.id}</span>
            <span>·</span>
            <span>{caseData.advocateName}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="text-center">
            <p className="font-semibold text-gray-800 text-lg">To continue, please sign in</p>
            <p className="text-gray-400 text-sm mt-1">
              You need an account to view and respond to this case invitation.
            </p>
          </div>

          <button
            onClick={() => navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`)}
            className="btn-primary py-3 text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login to my account
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={() => navigate(`/verify-email?redirect=${encodeURIComponent(redirectUrl)}`)}
            className="btn-secondary py-3 text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Create a new account
          </button>

          <p className="text-center text-xs text-gray-400">
            After signing in, you'll be brought back to this case automatically.
          </p>
        </div>
      </div>
    </div>
  )
}

function LogoHeader() {
  return (
    <div className="text-center mb-2">
      <div className="inline-flex items-center gap-2">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          E-Notary
        </span>
      </div>
      <p className="text-gray-400 text-xs mt-1">Secure Digital Notarization Platform</p>
    </div>
  )
}
