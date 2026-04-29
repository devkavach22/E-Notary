import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { sendEmailOtp, setEmail, resetSendOtp, setRegisterType } from '../store/slices/authSlice'
import AuthLayout from '../components/AuthLayout'

export default function EmailVerify() {
  const [emailInput, setEmailInput] = useState('')
  const [validationError, setValidationError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect')

  const { sendOtpStatus, sendOtpError, registerType } = useSelector((state) => state.auth)
  const loading = sendOtpStatus === 'loading'

  useEffect(() => {
    if (sendOtpStatus === 'succeeded') {
      dispatch(resetSendOtp())
      navigate('/verify-email-otp', { state: { email: emailInput, redirect } })
    }
  }, [sendOtpStatus])

  const validate = () => {
    if (!emailInput.trim()) return 'Email address is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) return 'Enter a valid email address'
    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setValidationError(err); return }
    setValidationError('')
    dispatch(setEmail(emailInput))
    dispatch(sendEmailOtp(emailInput))
  }

  return (
    <AuthLayout step={1} totalSteps={5} title="Create Account" subtitle="Choose your registration type and verify your email.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Registration Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Registration Type</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'individual', label: 'Individual', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )},
              { value: 'company', label: 'Company', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )},
            ].map(({ value, label, icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => dispatch(setRegisterType(value))}
                className={`flex items-center gap-2 justify-center p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200
                  ${registerType === value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'}`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => { setEmailInput(e.target.value); setValidationError('') }}
              placeholder="you@example.com"
              className={`input-field pl-10 ${validationError || sendOtpError ? 'input-error' : ''}`}
            />
          </div>

          {validationError && (
            <p className="error-msg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {validationError}
            </p>
          )}

          {sendOtpError && !validationError && (
            <p className="error-msg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {sendOtpError}
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
              Sending OTP...
            </>
          ) : 'Send OTP'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <span
            onClick={() => navigate(redirect ? `/login?redirect=${redirect}` : '/login')}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </AuthLayout>
  )
}
