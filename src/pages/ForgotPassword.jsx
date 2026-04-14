import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { sendForgotOtp, confirmPassword, resetForgotOtp, resetConfirmPass } from '../store/slices/authSlice'

const ErrMsg = ({ msg }) => !msg ? null : (
  <p className="error-msg">
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
    {msg}
  </p>
)

const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
)

export default function ForgotPassword() {
  const [step, setStep] = useState('email') // email | reset | done
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [resendTimer, setResendTimer] = useState(30)
  const inputs = useRef([])
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { forgotOtpStatus, forgotOtpError, confirmPassStatus } = useSelector((s) => s.auth)
  const sendingOtp = forgotOtpStatus === 'loading'
  const confirming = confirmPassStatus === 'loading'

  useEffect(() => {
    if (forgotOtpStatus === 'succeeded') {
      dispatch(resetForgotOtp())
      setStep('reset')
      setResendTimer(30)
    }
  }, [forgotOtpStatus])

  useEffect(() => {
    if (confirmPassStatus === 'succeeded') {
      dispatch(resetConfirmPass())
      setStep('done')
    }
  }, [confirmPassStatus])

  useEffect(() => {
    if (step === 'reset') {
      inputs.current[0]?.focus()
      const t = setInterval(() => setResendTimer(v => v > 0 ? v - 1 : 0), 1000)
      return () => clearInterval(t)
    }
  }, [step])

  const handleSendOtp = (e) => {
    e.preventDefault()
    if (!email.trim()) { setErrors({ email: 'Email is required' }); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrors({ email: 'Enter a valid email' }); return }
    setErrors({})
    dispatch(sendForgotOtp(email))
  }

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return
    const u = [...otp]; u[idx] = val; setOtp(u)
    setErrors(p => ({ ...p, otp: '' }))
    if (val && idx < 5) inputs.current[idx + 1]?.focus()
  }

  const handleOtpKey = (e, idx) => {
    if (e.key === 'Backspace') {
      if (!otp[idx] && idx > 0) inputs.current[idx - 1]?.focus()
      else { const u = [...otp]; u[idx] = ''; setOtp(u) }
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const u = [...otp]; pasted.split('').forEach((c, i) => { u[i] = c })
    setOtp(u); inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const getStrength = (p) => {
    let s = 0
    if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++
    if (/\d/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  }
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500']
  const strength = getStrength(newPassword)

  const handleReset = (e) => {
    e.preventDefault()
    const errs = {}
    if (otp.join('').length < 6) errs.otp = 'Enter the complete 6-digit OTP'
    if (!newPassword) errs.newPassword = 'New password is required'
    else if (newPassword.length < 8) errs.newPassword = 'Minimum 8 characters'
    else if (!/(?=.*[A-Z])(?=.*\d)/.test(newPassword)) errs.newPassword = 'Must include uppercase and number'
    if (!confirmPass) errs.confirmPass = 'Please confirm your password'
    else if (newPassword !== confirmPass) errs.confirmPass = 'Passwords do not match'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    dispatch(confirmPassword({ email, otp: otp.join(''), newPassword, confirmPassword: confirmPass }))
  }

  const Logo = () => (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 mb-2">
        <div className="w-10 h-10 bg-[#351159] rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className="text-2xl font-bold bg-[#351159] bg-clip-text text-transparent">E-Notary</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Logo />
        <div className="auth-card">

          {/* Step 1 — Email */}
          {step === 'email' && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                <p className="text-gray-500 text-sm mt-1">Enter your email to receive a reset OTP.</p>
              </div>
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </span>
                    <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors({}) }}
                      placeholder="you@example.com"
                      className={`input-field pl-10 ${errors.email ? 'input-error' : ''}`} />
                  </div>
                  <ErrMsg msg={errors.email || forgotOtpError} />
                </div>
                <button type="submit" disabled={sendingOtp} className="btn-primary flex items-center justify-center gap-2">
                  {sendingOtp ? <><Spinner /> Sending OTP...</> : 'Send OTP'}
                </button>
                <button type="button" onClick={() => navigate('/login')} className="btn-secondary">← Back to Login</button>
              </form>
            </>
          )}

          {/* Step 2 — OTP + New Password */}
          {step === 'reset' && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                <p className="text-gray-500 text-sm mt-1">Enter the OTP sent to <span className="font-medium text-indigo-600">{email}</span> and set your new password.</p>
              </div>
              <form onSubmit={handleReset} className="space-y-5">
                {/* OTP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
                  <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input key={idx} ref={(el) => (inputs.current[idx] = el)}
                        type="text" inputMode="numeric" maxLength={1} value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKey(e, idx)}
                        className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-gray-50
                          ${digit ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200'}
                          ${errors.otp ? 'border-red-400 bg-red-50' : ''}`}
                      />
                    ))}
                  </div>
                  <ErrMsg msg={errors.otp} />
                  <p className="text-xs text-gray-400 mt-2">
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` :
                      <span onClick={() => { setOtp(['','','','','','']); dispatch(sendForgotOtp(email)); setResendTimer(30) }}
                        className="text-indigo-600 cursor-pointer hover:underline font-medium">Resend OTP</span>}
                  </p>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <input type={showNew ? 'text' : 'password'} value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setErrors(p => ({ ...p, newPassword: '' })) }}
                      placeholder="Min. 8 characters"
                      className={`input-field pr-10 ${errors.newPassword ? 'input-error' : ''}`} />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showNew ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} /></svg>
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex gap-1">{[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? strengthColor[strength] : 'bg-gray-200'}`} />)}</div>
                      <p className={`text-xs font-medium ${strength <= 1 ? 'text-red-500' : strength === 2 ? 'text-yellow-500' : strength === 3 ? 'text-blue-500' : 'text-green-500'}`}>{strengthLabel[strength]} password</p>
                    </div>
                  )}
                  <ErrMsg msg={errors.newPassword} />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirm ? 'text' : 'password'} value={confirmPass}
                      onChange={(e) => { setConfirmPass(e.target.value); setErrors(p => ({ ...p, confirmPass: '' })) }}
                      placeholder="Re-enter new password"
                      className={`input-field pr-10 ${errors.confirmPass ? 'input-error' : ''}`} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showConfirm ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} /></svg>
                    </button>
                  </div>
                  {confirmPass && newPassword === confirmPass && <p className="text-green-500 text-xs mt-1 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>Passwords match</p>}
                  <ErrMsg msg={errors.confirmPass} />
                </div>

                <button type="submit" disabled={confirming} className="btn-primary flex items-center justify-center gap-2">
                  {confirming ? <><Spinner /> Resetting...</> : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          {/* Step 3 — Done */}
          {step === 'done' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Password Reset!</h2>
                <p className="text-gray-500 text-sm mt-1">Your password has been updated successfully.</p>
              </div>
              <button onClick={() => navigate('/login')} className="btn-primary">Go to Login</button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
