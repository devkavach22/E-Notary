import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import { fetchAdvocates, fetchPracticeAreas, fetchAdvocateTemplates, resetTemplates, fillTemplate, downloadTemplate } from '../store/slices/advocateSlice'

import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import WelcomeBanner from '../components/dashboard/WelcomeBanner'
import StatsGrid from '../components/dashboard/StatsGrid'
import QuickActions from '../components/dashboard/QuickActions'
import AdvocateList from '../components/advocates/AdvocateList'
import TemplateList from '../components/templates/TemplateList'
import TemplateForm from '../components/templates/TemplateForm'
import StampDocument from '../components/templates/StampDocument'
import ProfileCard from '../components/profile/ProfileCard'
import MyBookings from './MyBookings'
import BookingDetail from './BookingDetail'
import UploadCaseDocs from './UploadCaseDocs'
import MyCases from './MyCases'
import CaseDetail from './CaseDetail'
import Notifications from './Notifications'

const USER_FIELD_MAP = {
  'full name': 'fullName', 'name': 'fullName',
  "father's / husband's name": null,
  'date of birth': 'dateOfBirth', 'dob': 'dateOfBirth',
  'address': 'address', 'aadhaar number': 'aadhaarNumber', 'aadhaar': 'aadhaarNumber',
  'pan number': 'panNumber', 'pan': 'panNumber',
  'email': 'email', 'mobile': 'mobile', 'mobile number': 'mobile', 'phone': 'mobile',
  'city': 'city', 'state': 'state', 'pincode': 'pincode', 'gender': 'gender',
}

const getAutoValue = (fieldName, userData) => {
  const key = USER_FIELD_MAP[fieldName.toLowerCase()]
  if (!key || !userData?.[key]) return ''
  const val = userData[key]
  if (key === 'dateOfBirth' && val) return val.split('T')[0]
  return val
}

export default function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((s) => s.auth.user)
  const { advocates, total, fetchStatus, fetchError, practiceGroups, templates, templatesMeta, templatesStatus, templatesError, fillStatus, downloadStatus, submissionId, submissionStatus } = useSelector((s) => s.advocate)

  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [caseType, setCaseType] = useState('')
  const [category, setCategory] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [selectedBookingId, setSelectedBookingId] = useState(null)
  const [selectedCaseId, setSelectedCaseId] = useState(null)

  const categoryOptions = practiceGroups.find((g) => g.group === caseType)?.areas ?? []

  useEffect(() => { dispatch(fetchPracticeAreas()) }, [])

  useEffect(() => {
    if (activeNav === 'advocates' && (caseType || category)) {
      dispatch(fetchAdvocates({ caseType, category }))
    }
  }, [activeNav, caseType, category])

  const openTemplates = (adv) => {
    dispatch(fetchAdvocateTemplates({ advocateId: adv._id, practiceArea: caseType, category }))
    setActiveNav('templates')
  }

  const closeTemplates = () => {
    setSelectedTemplate(null)
    setFormValues({})
    setFormErrors({})
    dispatch(resetTemplates())
    setActiveNav('advocates')
  }

  const openTemplateForm = (tpl) => {
    const initial = {}
    tpl.fields.forEach((f) => {
      initial[f.fieldName] = getAutoValue(f.fieldName, templatesMeta.userData)
    })
    setFormValues(initial)
    setFormErrors({})
    setSelectedTemplate(tpl)
    setActiveNav('form')
  }

  const closeTemplateForm = () => {
    setSelectedTemplate(null)
    setFormValues({})
    setFormErrors({})
    setActiveNav('templates')
  }

  const handleFieldChange = (fieldName, value) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }))
    setFormErrors((prev) => ({ ...prev, [fieldName]: '' }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    selectedTemplate.fields.forEach((f) => {
      if (f.required && !formValues[f.fieldName]?.toString().trim()) {
        errs[f.fieldName] = `${f.fieldName} is required`
      }
    })
    if (Object.keys(errs).length) { setFormErrors(errs); return }
    const filledFields = selectedTemplate.fields.map((f) => ({
      fieldName: f.fieldName,
      ...(f.fieldType === 'image' ? { fieldType: 'image' } : {}),
      value: formValues[f.fieldName] ?? '',
    }))
    dispatch(fillTemplate({ templateId: selectedTemplate._id, filledFields })).then(res => {
      if (fillTemplate.fulfilled.match(res)) setActiveNav('stamp')
    })
  }

  const handleLogout = () => { dispatch(logout()); navigate('/login') }

  const handleViewBooking = (id) => { setSelectedBookingId(id); setActiveNav('booking-detail') }
  const handleViewCase = (id) => { setSelectedCaseId(id); setActiveNav('case-detail') }

  const displayName = user?.fullName || user?.name || user?.email || 'User'
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

 
  

  return (
    <div className="h-screen bg-transparent flex overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        displayName={displayName}
        initials={initials}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar
          activeNav={activeNav}
          setSidebarOpen={setSidebarOpen}
          selectedTemplate={selectedTemplate}
          displayName={displayName}
          initials={initials}
          onNavigate={setActiveNav}
        />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-transparent">

          {activeNav === 'dashboard' && (
            <div className="space-y-6">
              <WelcomeBanner displayName={displayName} />
              <StatsGrid />
              <QuickActions onNavigate={setActiveNav} />
            </div>
          )}

          {activeNav === 'advocates' && (
            <AdvocateList
              advocates={advocates}
              total={total}
              fetchStatus={fetchStatus}
              fetchError={fetchError}
              caseType={caseType}
              setCaseType={setCaseType}
              category={category}
              setCategory={setCategory}
              practiceGroups={practiceGroups}
              categoryOptions={categoryOptions}
              onBook={openTemplates}
            />
          )}

          {activeNav === 'templates' && (
            <TemplateList
              templates={templates}
              templatesMeta={templatesMeta}
              templatesStatus={templatesStatus}
              templatesError={templatesError}
              onBack={closeTemplates}
              onSelect={openTemplateForm}
            />
          )}

          {activeNav === 'form' && selectedTemplate && (
            <TemplateForm
              selectedTemplate={selectedTemplate}
              formValues={formValues}
              formErrors={formErrors}
              fillStatus={fillStatus}
              onBack={closeTemplateForm}
              onChange={handleFieldChange}
              onSubmit={handleFormSubmit}
              getAutoValue={getAutoValue}
              userData={templatesMeta.userData}
            />
          )}

          {activeNav === 'stamp' && selectedTemplate && (
            <StampDocument
              selectedTemplate={selectedTemplate}
              formValues={formValues}
              templatesMeta={templatesMeta}
              onEditForm={() => setActiveNav('form')}
              onDownload={() => dispatch(downloadTemplate(selectedTemplate._id))}
              downloadStatus={downloadStatus}
              submissionId={submissionId}
              submissionStatus={submissionStatus}
            />
          )}

          {activeNav === 'bookings' && (
            <MyBookings onViewBooking={handleViewBooking} />
          )}

          {activeNav === 'booking-detail' && selectedBookingId && (
            <BookingDetail
              bookingId={selectedBookingId}
              onBack={() => setActiveNav('bookings')}
              onUploadDocs={() => setActiveNav('upload-case-docs')}
            />
          )}

          {activeNav === 'upload-case-docs' && selectedBookingId && (
            <UploadCaseDocs
              bookingId={selectedBookingId}
              onBack={() => setActiveNav('booking-detail')}
            />
          )}

          {activeNav === 'cases' && (
            <MyCases onViewCase={handleViewCase} />
          )}

          {activeNav === 'case-detail' && selectedCaseId && (
            <CaseDetail
              caseId={selectedCaseId}
              onBack={() => setActiveNav('cases')}
            />
          )}

          {activeNav === 'notifications' && (
            <Notifications onViewCase={(id) => { setSelectedCaseId(id); setActiveNav('case-detail') }} />
          )}

          {activeNav === 'profile' && user && (
            <ProfileCard user={user} displayName={displayName} initials={initials} />
          )}

        </main>
      </div>
    </div>
  )
}
