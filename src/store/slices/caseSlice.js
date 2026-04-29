import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const BASE_URL = 'http://192.168.11.64:5000/api'

export const fetchMyBookings = createAsyncThunk(
  'case/fetchMyBookings',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token
      const res = await fetch(`${BASE_URL}/user/mybooking`, {
        headers: { Authorization: `${token}` },
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch bookings')
      return data.data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Mock data for frontend-only development
const MOCK_BOOKINGS = [
  {
    id: 'BK001',
    advocateId: 'adv1',
    advocateName: 'Adv. Rajesh Kumar',
    advocateCity: 'Mumbai',
    caseType: 'Property Law',
    category: 'Sale Deed',
    fee: 1500,
    bookedAt: '2026-04-10T10:00:00Z',
    status: 'confirmed',
    videoRoomUrl: 'https://meet.jit.si/enotary-BK001',
    consultationNotes: 'Client needs property sale deed notarized. Documents verified. Proceed with standard sale deed template. Ensure both parties are present during signing.',
    documentRequirements: [
      { id: 'dr1', name: 'Aadhaar Card (Front & Back)', required: true, uploaded: true, status: 'approved' },
      { id: 'dr2', name: 'PAN Card', required: true, uploaded: true, status: 'approved' },
      { id: 'dr3', name: 'Property Title Deed', required: true, uploaded: false, status: 'pending' },
      { id: 'dr4', name: 'NOC from Society', required: false, uploaded: false, status: 'pending' },
    ],
  },
  {
    id: 'BK002',
    advocateId: 'adv2',
    advocateName: 'Adv. Priya Sharma',
    advocateCity: 'Delhi',
    caseType: 'Family Law',
    category: 'Affidavit',
    fee: 800,
    bookedAt: '2026-04-12T14:00:00Z',
    status: 'pending',
    videoRoomUrl: null,
    consultationNotes: null,
    documentRequirements: [],
  },
]

const MOCK_CASES = [
  {
    id: 'CASE001',
    bookingId: 'BK001',
    advocateName: 'Adv. Rajesh Kumar',
    caseType: 'Property Law',
    category: 'Sale Deed',
    title: 'Property Sale Deed Notarization',
    currentStage: 'document_review',
    isMultiParty: true,
    coApplicants: [
      {
        id: 'cop1',
        role: 'Second Party (Buyer)',
        email: '',
        mobile: '',
        token: 'TOKEN-CASE001-A',
        status: 'pending',
        fields: {},
        invitedAt: null,
      },
    ],
    stages: [
      { key: 'booked', label: 'Appointment Booked', completedAt: '2026-04-10T10:00:00Z', status: 'done' },
      { key: 'consultation', label: 'Video Consultation', completedAt: '2026-04-11T11:00:00Z', status: 'done' },
      { key: 'document_upload', label: 'Documents Uploaded', completedAt: '2026-04-12T09:00:00Z', status: 'done' },
      { key: 'document_review', label: 'Document Review', completedAt: null, status: 'active' },
      { key: 'template_fill', label: 'Template Submission', completedAt: null, status: 'pending' },
      { key: 'esign', label: 'E-Signature', completedAt: null, status: 'pending' },
      { key: 'notarization', label: 'Notarization', completedAt: null, status: 'pending' },
      { key: 'completed', label: 'Completed', completedAt: null, status: 'pending' },
    ],
    rejectionReason: null,
    finalDocumentUrl: null,
    createdAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 'CASE002',
    bookingId: 'BK002',
    advocateName: 'Adv. Priya Sharma',
    caseType: 'Family Law',
    category: 'Affidavit',
    title: 'Name Change Affidavit',
    currentStage: 'rejected',
    isMultiParty: false,
    coApplicants: [],
    stages: [
      { key: 'booked', label: 'Appointment Booked', completedAt: '2026-04-12T14:00:00Z', status: 'done' },
      { key: 'consultation', label: 'Video Consultation', completedAt: '2026-04-13T10:00:00Z', status: 'done' },
      { key: 'document_upload', label: 'Documents Uploaded', completedAt: '2026-04-13T15:00:00Z', status: 'done' },
      { key: 'document_review', label: 'Document Review', completedAt: '2026-04-14T09:00:00Z', status: 'rejected' },
      { key: 'template_fill', label: 'Template Submission', completedAt: null, status: 'pending' },
      { key: 'esign', label: 'E-Signature', completedAt: null, status: 'pending' },
      { key: 'notarization', label: 'Notarization', completedAt: null, status: 'pending' },
      { key: 'completed', label: 'Completed', completedAt: null, status: 'pending' },
    ],
    rejectionReason: 'The uploaded Aadhaar card image is blurry and unreadable. Please re-upload a clear, high-resolution scan of your Aadhaar card (both front and back).',
    finalDocumentUrl: null,
    createdAt: '2026-04-12T14:00:00Z',
  },
  {
    id: 'CASE003',
    bookingId: 'BK003',
    advocateName: 'Adv. Suresh Patel',
    caseType: 'Business Law',
    category: 'Partnership Deed',
    title: 'Business Partnership Deed',
    currentStage: 'completed',
    isMultiParty: true,
    coApplicants: [
      {
        id: 'cop2',
        role: 'Second Partner',
        email: 'partner@example.com',
        mobile: '',
        token: 'TOKEN-CASE003-A',
        status: 'submitted',
        fields: { 'Partner Name': 'Vikram Shah', 'Share Percentage': '50%' },
        invitedAt: '2026-04-02T10:00:00Z',
      },
    ],
    stages: [
      { key: 'booked', label: 'Appointment Booked', completedAt: '2026-04-01T10:00:00Z', status: 'done' },
      { key: 'consultation', label: 'Video Consultation', completedAt: '2026-04-02T11:00:00Z', status: 'done' },
      { key: 'document_upload', label: 'Documents Uploaded', completedAt: '2026-04-03T09:00:00Z', status: 'done' },
      { key: 'document_review', label: 'Document Review', completedAt: '2026-04-04T10:00:00Z', status: 'done' },
      { key: 'template_fill', label: 'Template Submission', completedAt: '2026-04-05T11:00:00Z', status: 'done' },
      { key: 'esign', label: 'E-Signature', completedAt: '2026-04-06T12:00:00Z', status: 'done' },
      { key: 'notarization', label: 'Notarization', completedAt: '2026-04-07T14:00:00Z', status: 'done' },
      { key: 'completed', label: 'Completed', completedAt: '2026-04-07T15:00:00Z', status: 'done' },
    ],
    rejectionReason: null,
    finalDocumentUrl: '#',
    createdAt: '2026-04-01T10:00:00Z',
  },
]

const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'stage_change', message: 'Your case CASE001 moved to Document Review stage.', read: false, createdAt: '2026-04-14T08:00:00Z', caseId: 'CASE001' },
  { id: 'n2', type: 'rejection', message: 'Case CASE002 was rejected. Please re-submit documents.', read: false, createdAt: '2026-04-14T09:00:00Z', caseId: 'CASE002' },
  { id: 'n3', type: 'booking', message: 'Your appointment with Adv. Rajesh Kumar is confirmed.', read: true, createdAt: '2026-04-10T10:30:00Z', caseId: 'CASE001' },
  { id: 'n4', type: 'completed', message: 'Case CASE003 is completed. Download your notarized document.', read: true, createdAt: '2026-04-07T15:00:00Z', caseId: 'CASE003' },
]

const caseSlice = createSlice({
  name: 'case',
  initialState: {
    bookings: MOCK_BOOKINGS,
    bookingsStatus: 'idle',
    bookingsError: null,
    cases: MOCK_CASES,
    notifications: MOCK_NOTIFICATIONS,
    selectedCaseId: null,
    selectedBookingId: null,
  },
  reducers: {
    addBooking: (state, action) => {
      state.bookings.push(action.payload)
      state.notifications.unshift({
        id: `n${Date.now()}`,
        type: 'booking',
        message: `Your appointment with ${action.payload.advocateName} is confirmed.`,
        read: false,
        createdAt: new Date().toISOString(),
        caseId: null,
      })
    },
    markNotificationRead: (state, action) => {
      const n = state.notifications.find(n => n.id === action.payload)
      if (n) n.read = true
    },
    markAllRead: (state) => {
      state.notifications.forEach(n => { n.read = true })
    },
    setSelectedCase: (state, action) => {
      state.selectedCaseId = action.payload
    },
    setSelectedBooking: (state, action) => {
      state.selectedBookingId = action.payload
    },
    uploadDocumentForBooking: (state, action) => {
      const { bookingId, docId } = action.payload
      const booking = state.bookings.find(b => b.id === bookingId)
      if (booking) {
        const doc = booking.documentRequirements.find(d => d.id === docId)
        if (doc) { doc.uploaded = true; doc.status = 'under_review' }
      }
    },
    resubmitCase: (state, action) => {
      const c = state.cases.find(c => c.id === action.payload)
      if (c) {
        c.currentStage = 'document_upload'
        c.rejectionReason = null
        c.stages = c.stages.map(s =>
          s.key === 'document_review' ? { ...s, status: 'pending', completedAt: null } : s
        )
        state.notifications.unshift({
          id: `n${Date.now()}`,
          type: 'stage_change',
          message: `Case ${action.payload} re-submitted for review.`,
          read: false,
          createdAt: new Date().toISOString(),
          caseId: action.payload,
        })
      }
    },
    signDocument: (state, action) => {
      const c = state.cases.find(c => c.id === action.payload)
      if (c) {
        c.currentStage = 'notarization'
        c.stages = c.stages.map(s => {
          if (s.key === 'esign') return { ...s, status: 'done', completedAt: new Date().toISOString() }
          if (s.key === 'notarization') return { ...s, status: 'active' }
          return s
        })
        state.notifications.unshift({
          id: `n${Date.now()}`,
          type: 'stage_change',
          message: `Document signed for case ${action.payload}. Notarization in progress.`,
          read: false,
          createdAt: new Date().toISOString(),
          caseId: action.payload,
        })
      }
    },
    sendCoApplicantInvite: (state, action) => {
      // action.payload = { caseId, coApplicantId, email, mobile }
      const { caseId, coApplicantId, email, mobile } = action.payload
      const c = state.cases.find(c => c.id === caseId)
      if (!c) return
      const cop = c.coApplicants.find(p => p.id === coApplicantId)
      if (cop) {
        cop.email = email || cop.email
        cop.mobile = mobile || cop.mobile
        cop.invitedAt = new Date().toISOString()
        cop.status = 'invited'
      }
      state.notifications.unshift({
        id: `n${Date.now()}`,
        type: 'stage_change',
        message: `Co-applicant invite sent for case ${caseId}.`,
        read: false,
        createdAt: new Date().toISOString(),
        caseId,
      })
    },
    submitCoApplicantForm: (state, action) => {
      // action.payload = { token, fields }
      const { token, fields } = action.payload
      for (const c of state.cases) {
        const cop = c.coApplicants?.find(p => p.token === token)
        if (cop) {
          cop.fields = fields
          cop.status = 'submitted'
          state.notifications.unshift({
            id: `n${Date.now()}`,
            type: 'stage_change',
            message: `Co-applicant has submitted their details for case ${c.id}.`,
            read: false,
            createdAt: new Date().toISOString(),
            caseId: c.id,
          })
          break
        }
      }
    },
    addCoApplicant: (state, action) => {
      // action.payload = { caseId, role }
      const { caseId, role } = action.payload
      const c = state.cases.find(c => c.id === caseId)
      if (c) {
        c.isMultiParty = true
        c.coApplicants.push({
          id: `cop${Date.now()}`,
          role: role || 'Co-Applicant',
          email: '',
          mobile: '',
          token: `TOKEN-${caseId}-${Date.now()}`,
          status: 'pending',
          fields: {},
          invitedAt: null,
        })
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.bookingsStatus = 'loading'
        state.bookingsError = null
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.bookingsStatus = 'succeeded'
        state.bookings = action.payload
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.bookingsStatus = 'failed'
        state.bookingsError = action.payload
      })
  },
})

export const { addBooking, markNotificationRead, markAllRead, setSelectedCase, setSelectedBooking, uploadDocumentForBooking, resubmitCase, signDocument, sendCoApplicantInvite, submitCoApplicantForm, addCoApplicant } = caseSlice.actions
export default caseSlice.reducer
