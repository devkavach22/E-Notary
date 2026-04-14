import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const BASE_URL = 'http://192.168.11.64:5000/api'

// Fetch practice areas for dropdowns
export const fetchPracticeAreas = createAsyncThunk(
  'advocate/fetchPracticeAreas',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token
      const res = await fetch(`${BASE_URL}/advocates/practice-areas`, {
        headers: { Authorization: `${token}` },
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch practice areas')
      return data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Download a filled template as a file
export const downloadTemplate = createAsyncThunk(
  'advocate/downloadTemplate',
  async (templateId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token
      const res = await fetch(`${BASE_URL}/template/download/${templateId}`, {
        headers: { Authorization: `${token}` },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        return rejectWithValue(data.message || 'Download failed')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      // try to get filename from Content-Disposition, fallback to templateId
      const disposition = res.headers.get('Content-Disposition')
      const match = disposition?.match(/filename="?([^"]+)"?/)
      a.download = match?.[1] ?? `template-${templateId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      return true
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Fill a template with user data
export const fillTemplate = createAsyncThunk(
  'advocate/fillTemplate',
  async ({ templateId, filledFields }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token
      const res = await fetch(`${BASE_URL}/templates/${templateId}/fill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ filledFields }),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Failed to submit template')
      toast.success(
        `${data.message || 'Submitted successfully'} · ID: ${data.data?.submissionId?.slice(-6).toUpperCase()}`,
        { autoClose: 5000 }
      )
      return data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Fetch templates for a specific advocate
export const fetchAdvocateTemplates = createAsyncThunk(
  'advocate/fetchAdvocateTemplates',
  async ({ advocateId, practiceArea = '', category = '' }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token
      const params = new URLSearchParams()
      if (practiceArea) params.append('practiceArea', practiceArea)
      if (category) params.append('category', category)
      const res = await fetch(`${BASE_URL}/user/advocate/${advocateId}/templates?${params.toString()}`, {
        headers: { Authorization: `${token}` },
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch templates')
      return data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Fetch advocates with optional filters
export const fetchAdvocates = createAsyncThunk(
  'advocate/fetchAdvocates',
  async ({ caseType = '', category = '' } = {}, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token
      const params = new URLSearchParams()
      if (caseType) params.append('caseType', caseType)
      if (category) params.append('category', category)

      const res = await fetch(`${BASE_URL}/user/advocates?${params.toString()}`, {
        headers: { Authorization: `${token}` },
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch advocates')
      return data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

const advocateSlice = createSlice({
  name: 'advocate',
  initialState: {
    advocates: [],
    total: 0,
    filterApplied: {},
    fetchStatus: 'idle',
    fetchError: null,
    // practice areas
    practiceGroups: [],
    practiceAreasStatus: 'idle',
    // templates
    templates: [],
    templatesMeta: {},
    templatesStatus: 'idle',
    templatesError: null,
    // fill template
    fillStatus: 'idle',
    fillError: null,
    submissionId: null,
    submissionStatus: null,
    // download template
    downloadStatus: 'idle',
  },
  reducers: {
    resetAdvocates: (state) => {
      state.advocates = []
      state.total = 0
      state.fetchStatus = 'idle'
      state.fetchError = null
    },
    resetTemplates: (state) => {
      state.templates = []
      state.templatesMeta = {}
      state.templatesStatus = 'idle'
      state.templatesError = null
      state.fillStatus = 'idle'
      state.fillError = null
      state.submissionId = null
      state.submissionStatus = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPracticeAreas.pending, (state) => {
        state.practiceAreasStatus = 'loading'
      })
      .addCase(fetchPracticeAreas.fulfilled, (state, action) => {
        state.practiceAreasStatus = 'succeeded'
        state.practiceGroups = action.payload.grouped ?? []
      })
      .addCase(fetchPracticeAreas.rejected, (state) => {
        state.practiceAreasStatus = 'failed'
      })
      .addCase(fetchAdvocates.pending, (state) => {
        state.fetchStatus = 'loading'
        state.fetchError = null
      })
      .addCase(fetchAdvocates.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded'
        state.advocates = action.payload.data ?? []
        state.total = action.payload.total ?? 0
        state.filterApplied = action.payload.filterApplied ?? {}
      })
      .addCase(fetchAdvocates.rejected, (state, action) => {
        state.fetchStatus = 'failed'
        state.fetchError = action.payload
        toast.error(action.payload)
      })
      // fetchAdvocateTemplates
      .addCase(fetchAdvocateTemplates.pending, (state) => {
        state.templatesStatus = 'loading'
        state.templatesError = null
      })
      .addCase(fetchAdvocateTemplates.fulfilled, (state, action) => {
        state.templatesStatus = 'succeeded'
        state.templates = action.payload.data ?? []
        state.templatesMeta = {
          advocateName: action.payload.advocateName,
          filterApplied: action.payload.filterApplied,
          totalTemplates: action.payload.totalTemplates,
          userData: action.payload.userData ?? null,
        }
      })
      .addCase(fetchAdvocateTemplates.rejected, (state, action) => {
        state.templatesStatus = 'failed'
        state.templatesError = action.payload
        toast.error(action.payload)
      })
      // fillTemplate
      .addCase(fillTemplate.pending, (state) => {
        state.fillStatus = 'loading'
        state.fillError = null
      })
      .addCase(fillTemplate.fulfilled, (state, action) => {
        state.fillStatus = 'succeeded'
        state.submissionId = action.payload.data?.submissionId ?? null
        state.submissionStatus = action.payload.data?.status ?? null
      })
      .addCase(fillTemplate.rejected, (state, action) => {
        state.fillStatus = 'failed'
        state.fillError = action.payload
        toast.error(action.payload)
      })
      // downloadTemplate
      .addCase(downloadTemplate.pending, (state) => {
        state.downloadStatus = 'loading'
      })
      .addCase(downloadTemplate.fulfilled, (state) => {
        state.downloadStatus = 'idle'
      })
      .addCase(downloadTemplate.rejected, (state, action) => {
        state.downloadStatus = 'idle'
        toast.error(action.payload)
      })
  },
})

export const { resetAdvocates, resetTemplates } = advocateSlice.actions
export default advocateSlice.reducer
