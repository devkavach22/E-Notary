import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { sendPhoneOtp, resetSendPhoneOtp, verifyPhoneOtp, resetVerifyPhoneOtp } from '../store/slices/authSlice'
import AuthLayout from '../components/AuthLayout'

export default function MobileVerify() {
  const [step, setStep] = useState('enter')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [errors, setErrors] = useState({})
  const [resendTimer, setResendTimer] = useState(30)
  const inputs = useRef([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { sendPhoneOtpStatus, sendPhoneOtpError, verifyPhoneOtpStatus, verifyPhoneOtpError } = useSelector((state) => state.auth)
  const loading = sendPhoneOtpStatus === 'loading'
  const verifying = verifyPhoneOtpStatus === 'loading'

  // Navigate on mobile OTP verified
  useEffect(() => {
    if (verifyPhoneOtpStatus === 'succeeded') {
      dispatch(resetVerifyPhoneOtp())
      navigate('/upload-documents')
    }
  }, [verifyPhoneOtpStatus])

  // Move to OTP step on success
  useEffect(() => {
    if (sendPhoneOtpStatus === 'succeeded') {
      dispatch(resetSendPhoneOtp())
      setStep('otp')
      setResendTimer(30)
    }
  }, [sendPhoneOtpStatus])

  useEffect(() => {
    if (step === 'otp') {
      inputs.current[0]?.focus()
      const timer = setInterval(() => setResendTimer(t => t > 0 ? t - 1 : 0), 1000)
      return () => clearInterval(timer)
    }
  }, [step])

  const validateMobile = () => {
    if (!mobile.trim()) return 'Mobile number is required'
    if (!/^[6-9]\d{9}$/.test(mobile)) return 'Enter a valid 10-digit Indian mobile number'
    return ''
  }

  const handleSendOtp = (e) => {
    e.preventDefault()
    const err = validateMobile()
    if (err) { setErrors({ mobile: err }); return }
    setErrors({})
    dispatch(sendPhoneOtp(mobile))
  }

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return
    const updated = [...otp]; updated[idx] = val; setOtp(updated)
    setErrors({})
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
    if (code.length < 6) { setErrors({ otp: 'Please enter the complete 6-digit OTP' }); return }
    dispatch(verifyPhoneOtp({ mobile, otp: code }))
  }

  return (
    <AuthLayout step={3} totalSteps={5}
      title={step === 'enter' ? 'Verify Mobile Number' : 'Enter Mobile OTP'}
      subtitle={step === 'enter' ? 'Enter your mobile number to receive an OTP.' : `OTP sent to +91 ${mobile}`}>

      {step === 'enter' ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-4 border border-r-0 border-gray-200 rounded-l-xl bg-gray-50 text-gray-600 text-sm font-medium">
                🇮🇳 +91
              </span>
              <input
                type="tel" maxLength={10} value={mobile}
                onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '')); setErrors({}) }}
                placeholder="9876543210"
                className={`input-field rounded-l-none ${errors.mobile ? 'input-error' : ''}`}
              />
            </div>
            {errors.mobile && (
              <p className="error-msg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {errors.mobile}
              </p>
            )}
            {sendPhoneOtpError && !errors.mobile && (
              <p className="error-msg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {sendPhoneOtpError}
              </p>
            )}
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
            {loading
              ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Sending...</>
              : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex items-center gap-2 bg-indigo-50 rounded-xl p-3 text-sm text-indigo-700">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            OTP sent to <strong>+91 {mobile}</strong>
            <button type="button" onClick={() => setStep('enter')} className="ml-auto text-indigo-500 hover:text-indigo-700 text-xs underline">Change</button>
          </div>

          <div>
            <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input key={idx} ref={(el) => (inputs.current[idx] = el)}
                  type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 rounded-xl
                    focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                    transition-all duration-200 bg-gray-50
                    ${digit ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200'}
                    ${errors.otp ? 'border-red-400 bg-red-50' : ''}`}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="error-msg mt-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {errors.otp}
              </p>
            )}
          </div>

          <button type="submit" disabled={verifying} className="btn-primary flex items-center justify-center gap-2">
            {verifying
              ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Verifying...</>
              : 'Verify & Continue'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Didn't receive?{' '}
            {resendTimer > 0
              ? <span className="text-gray-400">Resend in {resendTimer}s</span>
              : <span onClick={() => { setOtp(['', '', '', '', '', '']); dispatch(sendPhoneOtp(mobile)) }} className="text-indigo-600 font-medium cursor-pointer hover:underline">Resend OTP</span>}
          </p>
        </form>
      )}
    </AuthLayout>
  )
}
