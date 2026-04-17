import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { registerUser, resetRegister } from '../store/slices/authSlice'
import AuthLayout from '../components/AuthLayout'

const initialForm = {
  firstName: '', lastName: '', email: '', mobile: '',
  dob: '', gender: '', address: '', city: '', state: '', pincode: '',
  aadhaarNumber: '', panNumber: '',
  password: '', confirmPassword: ''
}

// Convert "DD/MM/YYYY" → "YYYY-MM-DD" for date input
function toInputDate(str) {
  if (!str) return ''
  const [d, m, y] = str.split('/')
  return d && m && y ? `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}` : ''
}

// Split "RAJU SAHU" → { firstName: "RAJU", lastName: "SAHU" }
function splitName(fullName = '') {
  const parts = fullName.trim().split(' ')
  const lastName = parts.length > 1 ? parts.pop() : ''
  return { firstName: parts.join(' '), lastName }
}

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { state } = useLocation()
  const redirect = state?.redirect || null
  const extractedData = useSelector((s) => s.auth.extractedData)
  const storedEmail = useSelector((s) => s.auth.email)
  const filePaths = useSelector((s) => s.auth.filePaths)
  const { registerStatus } = useSelector((s) => s.auth)
  const loading = registerStatus === 'loading'

  const [form, setForm] = useState(() => {
    const { firstName, lastName } = splitName(extractedData?.fullName)
    return {
      ...initialForm,
      firstName,
      lastName,
      email: storedEmail || '',
      dob: toInputDate(extractedData?.dateOfBirth),
      gender: extractedData?.gender || '',
      aadhaarNumber: extractedData?.aadhaarNumber || '',
      panNumber: extractedData?.panNumber || '',
    }
  })

  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    else if (!/^[a-zA-Z\s]{2,}$/.test(form.firstName)) e.firstName = 'Enter a valid first name'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    else if (!/^[a-zA-Z\s]{2,}$/.test(form.lastName)) e.lastName = 'Enter a valid last name'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.mobile.trim()) e.mobile = 'Mobile number is required'
    else if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number'
    if (!form.dob) e.dob = 'Date of birth is required'
    else {
      const age = Math.floor((new Date() - new Date(form.dob)) / (365.25 * 24 * 60 * 60 * 1000))
      if (age < 18) e.dob = 'You must be at least 18 years old'
    }
    if (!form.gender) e.gender = 'Please select gender'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state.trim()) e.state = 'State is required'
    if (!form.pincode.trim()) e.pincode = 'Pincode is required'
    else if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    else if (!/(?=.*[A-Z])(?=.*\d)/.test(form.password)) e.password = 'Must include uppercase letter and number'
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    // Convert "YYYY-MM-DD" back to "DD/MM/YYYY" for API
    const [y, m, d] = form.dob.split('-')
    const dateOfBirth = `${d}/${m}/${y}`

    const fd = new FormData()
    fd.append('email', form.email)
    fd.append('fullName', `${form.firstName} ${form.lastName}`.trim())
    fd.append('mobile', form.mobile)
    fd.append('password', form.password)
    fd.append('dateOfBirth', dateOfBirth)
    fd.append('gender', form.gender.toLowerCase())
    fd.append('aadhaarNumber', form.aadhaarNumber)
    fd.append('panNumber', form.panNumber.toUpperCase())
    fd.append('address', form.address)
    fd.append('city', form.city)
    fd.append('state', form.state)
    fd.append('pincode', form.pincode)
    fd.append('aadhaarFrontPath', filePaths?.aadhaarFront || '')
    fd.append('panCardPath', filePaths?.panCard || '')

    dispatch(registerUser(fd)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(resetRegister())
        navigate(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login')
      }
    })
  }

  const Field = ({ label, name, type = 'text', placeholder, half }) => (
    <div className={half ? '' : 'col-span-2'}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input type={type} name={name} value={form[name]} onChange={handle} placeholder={placeholder}
        className={`input-field ${errors[name] ? 'input-error' : ''}`} />
      {errors[name] && <p className="error-msg">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
        {errors[name]}
      </p>}
    </div>
  )

  return (
    <AuthLayout step={5} totalSteps={5} title="Complete Registration" subtitle="Fill in your personal details to create your account.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" name="firstName" placeholder="John" half />
          <Field label="Last Name / Surname" name="lastName" placeholder="Doe" half />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handle} placeholder="you@example.com"
              className={`input-field ${errors.email ? 'input-error' : ''}`} />
            {errors.email && <p className="error-msg"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
            <input type="tel" name="mobile" value={form.mobile} onChange={(e) => { setForm({...form, mobile: e.target.value.replace(/\D/g,'')}); setErrors({...errors, mobile:''}) }}
              maxLength={10} placeholder="9876543210"
              className={`input-field ${errors.mobile ? 'input-error' : ''}`} />
            {errors.mobile && <p className="error-msg"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.mobile}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date of Birth" name="dob" type="date" half />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
            <select name="gender" value={form.gender} onChange={handle}
              className={`input-field ${errors.gender ? 'input-error' : ''}`}>
              <option value="">Select gender</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
            {errors.gender && <p className="error-msg"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.gender}</p>}
          </div>
        </div>

        <Field label="Address" name="address" placeholder="Street address, Area" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[['City','city','Mumbai'],['State','state','Maharashtra'],['Pincode','pincode','400001']].map(([label,name,ph]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <input type="text" name={name} value={form[name]} onChange={handle} placeholder={ph}
                className={`input-field ${errors[name] ? 'input-error' : ''}`} />
              {errors[name] && <p className="error-msg text-xs">{errors[name]}</p>}
            </div>
          ))}
        </div>

        {/* Auto-filled from documents */}
        {extractedData && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
            <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-xs text-green-700 font-medium">Details auto-filled from your uploaded documents</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Aadhaar Number
              {extractedData?.aadhaarNumber && <span className="ml-2 text-xs text-green-600 font-normal">✓ Auto-filled</span>}
            </label>
            <input type="text" name="aadhaarNumber" value={form.aadhaarNumber} onChange={handle}
              placeholder="XXXX XXXX XXXX" maxLength={12}
              className={`input-field ${errors.aadhaarNumber ? 'input-error' : ''} ${extractedData?.aadhaarNumber ? 'bg-green-50 border-green-300' : ''}`} />
            {errors.aadhaarNumber && <p className="error-msg"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.aadhaarNumber}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              PAN Number
              {extractedData?.panNumber && <span className="ml-2 text-xs text-green-600 font-normal">✓ Auto-filled</span>}
            </label>
            <input type="text" name="panNumber" value={form.panNumber} onChange={handle}
              placeholder="ABCDE1234F" maxLength={10}
              className={`input-field uppercase ${errors.panNumber ? 'input-error' : ''} ${extractedData?.panNumber ? 'bg-green-50 border-green-300' : ''}`} />
            {errors.panNumber && <p className="error-msg"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.panNumber}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handle}
                placeholder="Min. 8 characters" className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
              </button>
            </div>
            {errors.password && <p className="error-msg"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handle}
                placeholder="Re-enter password" className={`input-field pr-10 ${errors.confirmPassword ? 'input-error' : ''}`} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
              </button>
            </div>
            {errors.confirmPassword && <p className="error-msg"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.confirmPassword}</p>}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-2">
          {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Creating Account...</> : 'Create Account'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="text-indigo-600 font-medium cursor-pointer hover:underline">Login</span>
        </p>
      </form>
    </AuthLayout>
  )
}
