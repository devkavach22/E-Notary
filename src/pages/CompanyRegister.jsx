import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { registerCompany, resetRegisterCompany } from '../store/slices/authSlice'
import AuthLayout from '../components/AuthLayout'

const ENTITY_TYPES = [
  'Private Limited', 'Public Limited', 'LLP', 'Partnership', 'Sole Proprietorship', 'OPC', 'Section 8'
]

const initialForm = {
  companyName: '', entityType: '', registrationNumber: '', gstNumber: '',
  authorizedPersonName: '', authorizedPersonDesignation: '', authorizedPersonEmail: '', authorizedPersonMobile: '',
  registeredOfficeAddress: '', businessAddress: '', companyCity: '', companyState: '', companyPincode: '',
  password: '', confirmPassword: '',
}

const Field = ({ label, name, type = 'text', placeholder, form, errors, handle, span2 }) => (
  <div className={span2 ? 'col-span-2' : ''}>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <input type={type} name={name} value={form[name]} onChange={handle} placeholder={placeholder}
      className={`input-field ${errors[name] ? 'input-error' : ''}`} />
    {errors[name] && <p className="error-msg text-xs">{errors[name]}</p>}
  </div>
)

export default function CompanyRegister() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { state } = useLocation()
  const redirect = state?.redirect || null

  const storedEmail = useSelector((s) => s.auth.email)
  const companyFilePaths = useSelector((s) => s.auth.companyFilePaths)
  const { registerCompanyStatus } = useSelector((s) => s.auth)
  const loading = registerCompanyStatus === 'loading'

  const [form, setForm] = useState({ ...initialForm })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [regCert, setRegCert] = useState(null)
  const [authLetter, setAuthLetter] = useState(null)
  const [fileErrors, setFileErrors] = useState({})

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.companyName.trim()) e.companyName = 'Company name is required'
    if (!form.entityType) e.entityType = 'Entity type is required'
    if (!form.registrationNumber.trim()) e.registrationNumber = 'Registration number is required'
    if (!form.authorizedPersonName.trim()) e.authorizedPersonName = 'Authorized person name is required'
    if (!form.authorizedPersonDesignation.trim()) e.authorizedPersonDesignation = 'Designation is required'
    if (!form.authorizedPersonEmail.trim()) e.authorizedPersonEmail = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.authorizedPersonEmail)) e.authorizedPersonEmail = 'Enter a valid email'
    if (!form.authorizedPersonMobile.trim()) e.authorizedPersonMobile = 'Mobile is required'
    else if (!/^[6-9]\d{9}$/.test(form.authorizedPersonMobile)) e.authorizedPersonMobile = 'Enter valid 10-digit mobile'
    if (!form.registeredOfficeAddress.trim()) e.registeredOfficeAddress = 'Registered office address is required'
    if (!form.companyCity.trim()) e.companyCity = 'City is required'
    if (!form.companyState.trim()) e.companyState = 'State is required'
    if (!form.companyPincode.trim()) e.companyPincode = 'Pincode is required'
    else if (!/^\d{6}$/.test(form.companyPincode)) e.companyPincode = 'Enter valid 6-digit pincode'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    else if (!/(?=.*[A-Z])(?=.*\d)/.test(form.password)) e.password = 'Must include uppercase and number'
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const validateFiles = () => {
    const fe = {}
    if (!regCert) fe.regCert = 'Registration certificate is required'
    if (!authLetter) fe.authLetter = 'Authorization letter is required'
    return fe
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    const ferrs = validateFiles()
    if (Object.keys(errs).length || Object.keys(ferrs).length) {
      setErrors(errs)
      setFileErrors(ferrs)
      return
    }

    const fd = new FormData()
    fd.append('email', storedEmail)
    fd.append('mobile', form.authorizedPersonMobile)
    fd.append('password', form.password)
    fd.append('role', 'company')
    fd.append('companyName', form.companyName)
    fd.append('entityType', form.entityType)
    fd.append('registrationNumber', form.registrationNumber)
    if (form.gstNumber) fd.append('gstNumber', form.gstNumber)
    fd.append('authorizedPersonName', form.authorizedPersonName)
    fd.append('authorizedPersonDesignation', form.authorizedPersonDesignation)
    fd.append('authorizedPersonEmail', form.authorizedPersonEmail)
    fd.append('authorizedPersonMobile', form.authorizedPersonMobile)
    fd.append('registeredOfficeAddress', form.registeredOfficeAddress)
    fd.append('businessAddress', form.businessAddress || form.registeredOfficeAddress)
    fd.append('companyCity', form.companyCity)
    fd.append('companyState', form.companyState)
    fd.append('companyPincode', form.companyPincode)
    fd.append('registrationCertificate', regCert)
    fd.append('authorizationLetter', authLetter)

    dispatch(registerCompany(fd)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(resetRegisterCompany())
        navigate(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login')
      }
    })
  }

  return (
    <AuthLayout step={4} totalSteps={4} title="Company Registration" subtitle="Fill in your company details to create a business account.">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Company Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Company Name" name="companyName" placeholder="Tech Corp Pvt Ltd" span2 form={form} errors={errors} handle={handle} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Entity Type</label>
            <select name="entityType" value={form.entityType} onChange={handle}
              className={`input-field ${errors.entityType ? 'input-error' : ''}`}>
              <option value="">Select entity type</option>
              {ENTITY_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            {errors.entityType && <p className="error-msg text-xs">{errors.entityType}</p>}
          </div>
          <Field label="Registration Number" name="registrationNumber" placeholder="U72900MH2020PTC123456" form={form} errors={errors} handle={handle} />
          <Field label="GST Number (optional)" name="gstNumber" placeholder="27AAPFU0939F1ZV" form={form} errors={errors} handle={handle} />
        </div>

        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Authorized Person</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" name="authorizedPersonName" placeholder="Rahul Sharma" form={form} errors={errors} handle={handle} />
            <Field label="Designation" name="authorizedPersonDesignation" placeholder="Director" form={form} errors={errors} handle={handle} />
            <Field label="Email" name="authorizedPersonEmail" type="email" placeholder="rahul@techcorp.com" form={form} errors={errors} handle={handle} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile</label>
              <input type="tel" name="authorizedPersonMobile" value={form.authorizedPersonMobile}
                onChange={(e) => { setForm({ ...form, authorizedPersonMobile: e.target.value.replace(/\D/, '') }); setErrors({ ...errors, authorizedPersonMobile: '' }) }}
                maxLength={10} placeholder="9876543211"
                className={`input-field ${errors.authorizedPersonMobile ? 'input-error' : ''}`} />
              {errors.authorizedPersonMobile && <p className="error-msg text-xs">{errors.authorizedPersonMobile}</p>}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Address</p>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Registered Office Address" name="registeredOfficeAddress" placeholder="401, Sunshine Tower, Andheri East" span2 form={form} errors={errors} handle={handle} />
            <Field label="Business Address (if different)" name="businessAddress" placeholder="501, Empire Tower, BKC" span2 form={form} errors={errors} handle={handle} />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[['City', 'companyCity', 'Mumbai'], ['State', 'companyState', 'Maharashtra'], ['Pincode', 'companyPincode', '400069']].map(([label, name, ph]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input type="text" name={name} value={form[name]} onChange={handle} placeholder={ph}
                  className={`input-field ${errors[name] ? 'input-error' : ''}`} />
                {errors[name] && <p className="error-msg text-xs">{errors[name]}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Document Uploads */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Documents</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'regCert', label: 'Registration Certificate', file: regCert, set: setRegCert, errKey: 'regCert' },
              { key: 'authLetter', label: 'Authorization Letter', file: authLetter, set: setAuthLetter, errKey: 'authLetter' },
            ].map(({ key, label, file, set, errKey }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all
                  ${file ? 'border-green-400 bg-green-50' : fileErrors[errKey] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'}`}>
                  {file ? (
                    <div className="text-center px-3">
                      <p className="text-sm font-medium text-green-700 truncate max-w-[180px]">{file.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Click to change</p>
                    </div>
                  ) : (
                    <div className="text-center px-3">
                      <svg className={`w-5 h-5 mx-auto mb-1 ${fileErrors[errKey] ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
                      </svg>
                      <p className={`text-xs ${fileErrors[errKey] ? 'text-red-500' : 'text-gray-500'}`}>Upload {label}</p>
                      <p className="text-xs text-gray-400">PDF, JPG, PNG · Max 5MB</p>
                    </div>
                  )}
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                    onChange={(e) => { set(e.target.files[0]); setFileErrors(fe => ({ ...fe, [errKey]: '' })) }} />
                </label>
                {fileErrors[errKey] && <p className="error-msg text-xs mt-1">{fileErrors[errKey]}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Password */}
        <div className="border-t border-gray-100 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'password', label: 'Password', show: showPass, toggle: () => setShowPass(!showPass) },
              { name: 'confirmPassword', label: 'Confirm Password', show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
            ].map(({ name, label, show, toggle }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} name={name} value={form[name]} onChange={handle}
                    placeholder={name === 'password' ? 'Min. 8 characters' : 'Re-enter password'}
                    className={`input-field pr-10 ${errors[name] ? 'input-error' : ''}`} />
                  <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {show
                      ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                  </button>
                </div>
                {errors[name] && <p className="error-msg text-xs">{errors[name]}</p>}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-2">
          {loading
            ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Registering...</>
            : 'Register Company'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="text-indigo-600 font-medium cursor-pointer hover:underline">Login</span>
        </p>
      </form>
    </AuthLayout>
  )
}
