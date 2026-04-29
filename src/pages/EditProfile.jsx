import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateProfile, resetUpdateProfile,
  sendPhoneOtp, resetSendPhoneOtp,
  verifyPhoneOtp, resetVerifyPhoneOtp,
  sendEmailOtp, resetSendOtp,
  verifyEmailOtp, resetVerifyOtp,
} from '../store/slices/authSlice'

// Inline OTP modal for verifying new mobile before saving
function MobileOtpModal({ mobile, onVerified, onClose }) {
  const dispatch = useDispatch()
  const { sendPhoneOtpStatus, verifyPhoneOtpStatus, verifyPhoneOtpError } = useSelector(s => s.auth)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [resendTimer, setResendTimer] = useState(30)
  const inputs = useRef([])

  // Send OTP on mount
  useEffect(() => {
    dispatch(sendPhoneOtp(mobile))
    return () => {
      dispatch(resetSendPhoneOtp())
      dispatch(resetVerifyPhoneOtp())
    }
  }, [])

  useEffect(() => {
    if (sendPhoneOtpStatus === 'succeeded') {
      dispatch(resetSendPhoneOtp())
      setResendTimer(30)
      inputs.current[0]?.focus()
    }
  }, [sendPhoneOtpStatus])

  useEffect(() => {
    const timer = setInterval(() => setResendTimer(t => t > 0 ? t - 1 : 0), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (verifyPhoneOtpStatus === 'succeeded') {
      dispatch(resetVerifyPhoneOtp())
      onVerified()
    }
  }, [verifyPhoneOtpStatus])

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return
    const updated = [...otp]; updated[idx] = val; setOtp(updated)
    setOtpError('')
    if (val && idx < 5) inputs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (!otp[idx] && idx > 0) inputs.current[idx - 1]?.focus()
      else { const u = [...otp]; u[idx] = ''; setOtp(u) }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const updated = [...otp]
    pasted.split('').forEach((ch, i) => { updated[i] = ch })
    setOtp(updated)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleVerify = (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { setOtpError('Please enter the complete 6-digit OTP'); return }
    dispatch(verifyPhoneOtp({ mobile, otp: code }))
  }

  const verifying = verifyPhoneOtpStatus === 'loading'
  const sending = sendPhoneOtpStatus === 'loading'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">Verify Mobile Number</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          OTP sent to <span className="font-semibold text-gray-700">+91 {mobile}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-5">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => (inputs.current[idx] = el)}
                type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={e => handleChange(e.target.value, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                className={`w-10 h-12 text-center text-lg font-bold border-2 rounded-xl
                  focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                  transition-all bg-gray-50
                  ${digit ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200'}
                  ${otpError || verifyPhoneOtpError ? 'border-red-400 bg-red-50' : ''}`}
              />
            ))}
          </div>

          {(otpError || verifyPhoneOtpError) && (
            <p className="text-xs text-red-500">{otpError || verifyPhoneOtpError}</p>
          )}

          <button
            type="submit"
            disabled={verifying}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {verifying && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            Verify & Continue
          </button>

          <p className="text-center text-sm text-gray-500">
            Didn't receive?{' '}
            {resendTimer > 0
              ? <span className="text-gray-400">Resend in {resendTimer}s</span>
              : (
                <span
                  onClick={() => !sending && dispatch(sendPhoneOtp(mobile))}
                  className="text-indigo-600 font-medium cursor-pointer hover:underline"
                >
                  {sending ? 'Sending...' : 'Resend OTP'}
                </span>
              )}
          </p>
        </form>
      </div>
    </div>
  )
}

// Inline OTP modal for verifying new email before saving
function EmailOtpModal({ email, onVerified, onClose }) {
  const dispatch = useDispatch()
  const { sendOtpStatus, verifyOtpStatus, verifyOtpError } = useSelector(s => s.auth)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [resendTimer, setResendTimer] = useState(30)
  const inputs = useRef([])

  useEffect(() => {
    dispatch(sendEmailOtp(email))
    return () => {
      dispatch(resetSendOtp())
      dispatch(resetVerifyOtp())
    }
  }, [])

  useEffect(() => {
    if (sendOtpStatus === 'succeeded') {
      dispatch(resetSendOtp())
      setResendTimer(30)
      inputs.current[0]?.focus()
    }
  }, [sendOtpStatus])

  useEffect(() => {
    const timer = setInterval(() => setResendTimer(t => t > 0 ? t - 1 : 0), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (verifyOtpStatus === 'succeeded') {
      dispatch(resetVerifyOtp())
      onVerified()
    }
  }, [verifyOtpStatus])

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return
    const updated = [...otp]; updated[idx] = val; setOtp(updated)
    setOtpError('')
    if (val && idx < 5) inputs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (!otp[idx] && idx > 0) inputs.current[idx - 1]?.focus()
      else { const u = [...otp]; u[idx] = ''; setOtp(u) }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const updated = [...otp]
    pasted.split('').forEach((ch, i) => { updated[i] = ch })
    setOtp(updated)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleVerify = (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { setOtpError('Please enter the complete 6-digit OTP'); return }
    dispatch(verifyEmailOtp({ email, otp: code }))
  }

  const verifying = verifyOtpStatus === 'loading'
  const sending = sendOtpStatus === 'loading'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">Verify Email Address</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          OTP sent to <span className="font-semibold text-gray-700">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-5">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => (inputs.current[idx] = el)}
                type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={e => handleChange(e.target.value, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                className={`w-10 h-12 text-center text-lg font-bold border-2 rounded-xl
                  focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                  transition-all bg-gray-50
                  ${digit ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200'}
                  ${otpError || verifyOtpError ? 'border-red-400 bg-red-50' : ''}`}
              />
            ))}
          </div>

          {(otpError || verifyOtpError) && (
            <p className="text-xs text-red-500">{otpError || verifyOtpError}</p>
          )}

          <button
            type="submit"
            disabled={verifying}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {verifying && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            Verify & Continue
          </button>

          <p className="text-center text-sm text-gray-500">
            Didn't receive?{' '}
            {resendTimer > 0
              ? <span className="text-gray-400">Resend in {resendTimer}s</span>
              : (
                <span
                  onClick={() => !sending && dispatch(sendEmailOtp(email))}
                  className="text-indigo-600 font-medium cursor-pointer hover:underline"
                >
                  {sending ? 'Sending...' : 'Resend OTP'}
                </span>
              )}
          </p>
        </form>
      </div>
    </div>
  )
}

export default function EditProfile({ onBack }) {
  const dispatch = useDispatch()
  const { user, updateProfileStatus, updateProfileError } = useSelector(s => s.auth)

  const [form, setForm] = useState({
    email: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  // Track which mobile has been OTP-verified in this session
  const [verifiedMobile, setVerifiedMobile] = useState(null)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [mobileError, setMobileError] = useState('')

  // Track which email has been OTP-verified in this session
  const [verifiedEmail, setVerifiedEmail] = useState(null)
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false)
  const [emailError, setEmailError] = useState('')
  useEffect(() => {
    if (user) {
      setForm({
        email: user.email || '',
        mobile: user.mobile || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
      })
      // Original mobile is considered already verified
      setVerifiedMobile(user.mobile || null)
      // Original email is considered already verified
      setVerifiedEmail(user.email || null)
    }
  }, [user])

  useEffect(() => {
    if (updateProfileStatus === 'succeeded') {
      dispatch(resetUpdateProfile())
      onBack()
    }
  }, [updateProfileStatus])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'mobile') {
      setMobileError('')
      // If user changes mobile away from verified value, require re-verification
      if (value !== verifiedMobile) setVerifiedMobile(null)
    }
    if (name === 'email') {
      setEmailError('')
      // If user changes email away from verified value, require re-verification
      if (value !== verifiedEmail) setVerifiedEmail(null)
    }
  }

  const handleMobileVerify = () => {
    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      setMobileError('Enter a valid 10-digit Indian mobile number')
      return
    }
    setMobileError('')
    setShowOtpModal(true)
  }

  const handleOtpVerified = () => {
    setVerifiedMobile(form.mobile)
    setShowOtpModal(false)
  }

  const handleEmailVerify = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setEmailError('Enter a valid email address')
      return
    }
    setEmailError('')
    setShowEmailOtpModal(true)
  }

  const handleEmailOtpVerified = () => {
    setVerifiedEmail(form.email)
    setShowEmailOtpModal(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.mobile !== user?.mobile && form.mobile !== verifiedMobile) {
      setMobileError('Please verify your new mobile number before saving')
      return
    }
    if (form.email !== user?.email && form.email !== verifiedEmail) {
      setEmailError('Please verify your new email address before saving')
      return
    }
    dispatch(updateProfile({ ...form, role: user?.role || 'user' }))
  }

  const mobileChanged = form.mobile !== (user?.mobile || '')
  const mobileVerified = form.mobile === verifiedMobile
  const emailChanged = form.email !== (user?.email || '')
  const emailVerified = form.email === verifiedEmail

  const fields = [
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'state', label: 'State', type: 'text' },
    { name: 'pincode', label: 'Pincode', type: 'text' },
  ]

  return (
    <>
      {showOtpModal && (
        <MobileOtpModal
          mobile={form.mobile}
          onVerified={handleOtpVerified}
          onClose={() => setShowOtpModal(false)}
        />
      )}

      {showEmailOtpModal && (
        <EmailOtpModal
          email={form.email}
          onVerified={handleEmailOtpVerified}
          onClose={() => setShowEmailOtpModal(false)}
        />
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-bold text-gray-800">Edit Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mobile field — special handling */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label htmlFor="mobile" className="text-xs text-gray-500 font-medium">Mobile</label>
            <div className="flex gap-2">
              <input
                id="mobile"
                name="mobile"
                type="tel"
                maxLength={10}
                value={form.mobile}
                onChange={handleChange}
                className={`flex-1 border rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50
                  ${mobileError ? 'border-red-400' : 'border-gray-200'}`}
              />
              {mobileChanged && !mobileVerified && (
                <button
                  type="button"
                  onClick={handleMobileVerify}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors whitespace-nowrap"
                >
                  Verify
                </button>
              )}
              {mobileVerified && mobileChanged && (
                <span className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 whitespace-nowrap">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            {mobileError && <p className="text-xs text-red-500 mt-0.5">{mobileError}</p>}
            {mobileChanged && !mobileVerified && !mobileError && (
              <p className="text-xs text-amber-600 mt-0.5">You must verify the new number before saving.</p>
            )}
          </div>

          {/* Email field — requires OTP verification if changed */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label htmlFor="email" className="text-xs text-gray-500 font-medium">Email</label>
            <div className="flex gap-2">
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`flex-1 border rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50
                  ${emailError ? 'border-red-400' : 'border-gray-200'}`}
              />
              {emailChanged && !emailVerified && (
                <button
                  type="button"
                  onClick={handleEmailVerify}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors whitespace-nowrap"
                >
                  Verify
                </button>
              )}
              {emailVerified && emailChanged && (
                <span className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 whitespace-nowrap">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            {emailError && <p className="text-xs text-red-500 mt-0.5">{emailError}</p>}
            {emailChanged && !emailVerified && !emailError && (
              <p className="text-xs text-amber-600 mt-0.5">You must verify the new email before saving.</p>
            )}
          </div>

          {/* Other editable fields */}          {fields.map(({ name, label, type }) => (
            <div key={name} className="flex flex-col gap-1">
              <label htmlFor={name} className="text-xs text-gray-500 font-medium">{label}</label>
              <input
                id={name}
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
              />
            </div>
          ))}

          {updateProfileError && (
            <p className="sm:col-span-2 text-sm text-red-500">{updateProfileError}</p>
          )}

          <div className="sm:col-span-2 flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 rounded-xl text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProfileStatus === 'loading' || (mobileChanged && !mobileVerified) || (emailChanged && !emailVerified)}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {updateProfileStatus === 'loading' && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
