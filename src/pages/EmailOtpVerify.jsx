import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { verifyEmailOtp, sendEmailOtp, resetVerifyOtp } from '../store/slices/authSlice'
import AuthLayout from '../components/AuthLayout'

export default function EmailOtpVerify() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [validationError, setValidationError] = useState('')
  const [resendTimer, setResendTimer] = useState(30)
  const inputs = useRef([])
  const navigate = useNavigate()
  const { state } = useLocation()
  const dispatch = useDispatch()

  const email = useSelector((s) => s.auth.email) || state?.email || ''
  const redirect = state?.redirect || null
  const { verifyOtpStatus, verifyOtpError } = useSelector((s) => s.auth)
  const loading = verifyOtpStatus === 'loading'

  useEffect(() => {
    inputs.current[0]?.focus()
    const timer = setInterval(() => setResendTimer(t => t > 0 ? t - 1 : 0), 1000)
    return () => clearInterval(timer)
  }, [])

  // Navigate on success
  useEffect(() => {
    if (verifyOtpStatus === 'succeeded') {
      dispatch(resetVerifyOtp())
      navigate('/verify-mobile', { state: { redirect } })
    }
  }, [verifyOtpStatus])

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return
    const updated = [...otp]; updated[idx] = val; setOtp(updated)
    setValidationError('')
    if (val && idx < 5) inputs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (!otp[idx] && idx > 0) inputs.current[idx - 1]?.focus()
      else { const u = [...otp]; u[idx] = ''; setOtp(u) }
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputs.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && idx < 5) inputs.current[idx + 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const updated = [...otp]
    pasted.split('').forEach((ch, i) => { updated[i] = ch })
    setOtp(updated)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { setValidationError('Please enter the complete 6-digit OTP'); return }
    setValidationError('')
    dispatch(verifyEmailOtp({ email, otp: code }))
  }

  const handleResend = () => {
    if (resendTimer > 0) return
    setOtp(['', '', '', '', '', ''])
    setResendTimer(30)
    inputs.current[0]?.focus()
    dispatch(sendEmailOtp(email))
  }

  return (
    <AuthLayout step={2} totalSteps={5} title="Email OTP Verification" subtitle={`Enter the 6-digit OTP sent to ${email}`}>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* OTP boxes */}
        <div>
          <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputs.current[idx] = el)}
                type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 rounded-xl
                  focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                  transition-all duration-200 bg-gray-50
                  ${digit ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200'}
                  ${validationError || verifyOtpError ? 'border-red-400 bg-red-50' : ''}`}
              />
            ))}
          </div>

          {validationError && (
            <p className="error-msg mt-2">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {validationError}
            </p>
          )}
          {verifyOtpError && !validationError && (
            <p className="error-msg mt-2">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {verifyOtpError}
            </p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Verifying...
            </>
          ) : 'Verify OTP'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Didn't receive the OTP?{' '}
          {resendTimer > 0 ? (
            <span className="text-gray-400">Resend in {resendTimer}s</span>
          ) : (
            <span onClick={handleResend} className="text-indigo-600 font-medium cursor-pointer hover:underline">
              Resend OTP
            </span>
          )}
        </p>
      </form>
    </AuthLayout>
  )
}
