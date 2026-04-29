import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const BASE_URL = 'http://192.168.11.64:5000/api'

// Send Email OTP
export const sendEmailOtp = createAsyncThunk(
  'auth/sendEmailOtp',
  async (email, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Failed to send OTP')
      toast.success(data.message || 'OTP sent successfully')
      return data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Verify Email OTP
export const verifyEmailOtp = createAsyncThunk(
  'auth/verifyEmailOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Invalid OTP. Please try again.')
      toast.success(data.message || 'OTP verified successfully')
      return data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Verify Mobile OTP
export const verifyPhoneOtp = createAsyncThunk(
  'auth/verifyPhoneOtp',
  async ({ mobile, otp }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/verify-mobile-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp }),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Invalid OTP. Please try again.')
      toast.success(data.message || 'Mobile verified successfully')
      return data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Send Mobile OTP
export const sendPhoneOtp = createAsyncThunk(
  'auth/sendPhoneOtp',
  async (mobile, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/send-mobile-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Failed to send OTP')
      toast.success(data.message || 'OTP sent successfully')
      return data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Upload Aadhaar and PAN
export const uploadDocuments = createAsyncThunk(
  'auth/uploadDocuments',
  async ({ aadhaarFront, panCard }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('aadhaarFront', aadhaarFront)
      formData.append('panCard', panCard)
      const res = await fetch(`${BASE_URL}/user/verify-documents`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Document upload failed')
      toast.success(data.message || 'Documents uploaded successfully')
      return data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Register User
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/user/register`, {
        method: 'POST',
        body: formData, // FormData with all fields
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Registration failed')
      toast.success(data.message || 'Registration successful')
      return data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Register Company
export const registerCompany = createAsyncThunk(
  'auth/registerCompany',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/company/register`, {
        method: 'POST',
        body: formData, // FormData with all company fields
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Company registration failed')
      toast.success(data.message || 'Company registration successful')
      return data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Send Forget Password OTP
export const sendForgotOtp = createAsyncThunk(
  'auth/sendForgotOtp',
  async ({ email, role }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/send-forget-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Failed to send OTP')
      toast.success(data.message || 'OTP sent to your email')
      return data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Confirm Password (reset with OTP)
export const confirmPassword = createAsyncThunk(
  'auth/confirmPassword',
  async ({ email, otp, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/confirm-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Failed to reset password')
      toast.success(data.message || 'Password reset successfully')
      return data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Update User Profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token
      const res = await fetch(`${BASE_URL}/user/profile/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Failed to update profile')
      toast.success(data.message || 'Profile updated successfully')
      return data.data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Fetch User Profile
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token
      const res = await fetch(`${BASE_URL}/user/profile`, {
        headers: { Authorization: `${token}` },
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch profile')
      return data.data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

// Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.message || 'Login failed')
      toast.success(data.message || 'Login successful')
      return data
    } catch (err) {
      return rejectWithValue('Network error. Please try again.')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    email: '',
    registerType: 'individual', // 'individual' | 'company'
    // sendEmailOtp
    sendOtpStatus: 'idle',
    sendOtpError: null,
    // verifyEmailOtp
    verifyOtpStatus: 'idle',
    verifyOtpError: null,
    // sendPhoneOtp
    sendPhoneOtpStatus: 'idle',
    sendPhoneOtpError: null,
    // verifyPhoneOtp
    verifyPhoneOtpStatus: 'idle',
    verifyPhoneOtpError: null,
    // uploadDocuments
    uploadDocsStatus: 'idle',
    uploadDocsError: null,
    extractedData: null,
    filePaths: null,
    // registerUser
    registerStatus: 'idle',
    registerError: null,
    // registerCompany
    registerCompanyStatus: 'idle',
    registerCompanyError: null,
    // loginUser
    loginStatus: 'idle',
    loginError: null,
    token: localStorage.getItem('token') ?? null,
    user: JSON.parse(localStorage.getItem('user')) ?? null,
    // forgotPassword
    forgotOtpStatus: 'idle',
    forgotOtpError: null,
    // confirmPassword
    confirmPassStatus: 'idle',
    confirmPassError: null,
    // profile
    profileStatus: 'idle',
    // updateProfile
    updateProfileStatus: 'idle',
    updateProfileError: null,
  },
  reducers: {
    setEmail: (state, action) => { state.email = action.payload },
    setRegisterType: (state, action) => { state.registerType = action.payload },
    resetSendOtp: (state) => { state.sendOtpStatus = 'idle'; state.sendOtpError = null },
    resetVerifyOtp: (state) => { state.verifyOtpStatus = 'idle'; state.verifyOtpError = null },
    resetSendPhoneOtp: (state) => { state.sendPhoneOtpStatus = 'idle'; state.sendPhoneOtpError = null },
    resetVerifyPhoneOtp: (state) => { state.verifyPhoneOtpStatus = 'idle'; state.verifyPhoneOtpError = null },
    resetUploadDocs: (state) => { state.uploadDocsStatus = 'idle'; state.uploadDocsError = null },
    resetRegister: (state) => { state.registerStatus = 'idle'; state.registerError = null },
    resetRegisterCompany: (state) => { state.registerCompanyStatus = 'idle'; state.registerCompanyError = null },
    resetLogin: (state) => { state.loginStatus = 'idle'; state.loginError = null },
    logout: (state) => {
      state.token = null
      state.user = null
      state.loginStatus = 'idle'
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    resetForgotOtp: (state) => { state.forgotOtpStatus = 'idle'; state.forgotOtpError = null },
    resetConfirmPass: (state) => { state.confirmPassStatus = 'idle'; state.confirmPassError = null },
    resetUpdateProfile: (state) => { state.updateProfileStatus = 'idle'; state.updateProfileError = null },
  },
  extraReducers: (builder) => {
    builder
      // sendEmailOtp
      .addCase(sendEmailOtp.pending, (state) => {
        state.sendOtpStatus = 'loading'
        state.sendOtpError = null
      })
      .addCase(sendEmailOtp.fulfilled, (state) => {
        state.sendOtpStatus = 'succeeded'
      })
      .addCase(sendEmailOtp.rejected, (state, action) => {
        state.sendOtpStatus = 'failed'
        state.sendOtpError = action.payload
        toast.error(action.payload)
      })
      // verifyEmailOtp
      .addCase(verifyEmailOtp.pending, (state) => {
        state.verifyOtpStatus = 'loading'
        state.verifyOtpError = null
      })
      .addCase(verifyEmailOtp.fulfilled, (state) => {
        state.verifyOtpStatus = 'succeeded'
      })
      .addCase(verifyEmailOtp.rejected, (state, action) => {
        state.verifyOtpStatus = 'failed'
        state.verifyOtpError = action.payload
        toast.error(action.payload)
      })
      // verifyPhoneOtp
      .addCase(verifyPhoneOtp.pending, (state) => {
        state.verifyPhoneOtpStatus = 'loading'
        state.verifyPhoneOtpError = null
      })
      .addCase(verifyPhoneOtp.fulfilled, (state) => {
        state.verifyPhoneOtpStatus = 'succeeded'
      })
      .addCase(verifyPhoneOtp.rejected, (state, action) => {
        state.verifyPhoneOtpStatus = 'failed'
        state.verifyPhoneOtpError = action.payload
        toast.error(action.payload)
      })
      // sendPhoneOtp
      .addCase(sendPhoneOtp.pending, (state) => {
        state.sendPhoneOtpStatus = 'loading'
        state.sendPhoneOtpError = null
      })
      .addCase(sendPhoneOtp.fulfilled, (state) => {
        state.sendPhoneOtpStatus = 'succeeded'
      })
      .addCase(sendPhoneOtp.rejected, (state, action) => {
        state.sendPhoneOtpStatus = 'failed'
        state.sendPhoneOtpError = action.payload
        toast.error(action.payload)
      })
      // uploadDocuments
      .addCase(uploadDocuments.pending, (state) => {
        state.uploadDocsStatus = 'loading'
        state.uploadDocsError = null
      })
      .addCase(uploadDocuments.fulfilled, (state, action) => {
        state.uploadDocsStatus = 'succeeded'
        state.extractedData = action.payload.extractedData ?? null
        state.filePaths = action.payload.filePaths ?? null
      })
      .addCase(uploadDocuments.rejected, (state, action) => {
        state.uploadDocsStatus = 'failed'
        state.uploadDocsError = action.payload
        toast.error(action.payload)
      })
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = 'loading'
        state.registerError = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerStatus = 'succeeded'
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = 'failed'
        state.registerError = action.payload
        toast.error(action.payload)
      })
      // registerCompany
      .addCase(registerCompany.pending, (state) => {
        state.registerCompanyStatus = 'loading'
        state.registerCompanyError = null
      })
      .addCase(registerCompany.fulfilled, (state) => {
        state.registerCompanyStatus = 'succeeded'
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.registerCompanyStatus = 'failed'
        state.registerCompanyError = action.payload
        toast.error(action.payload)
      })
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = 'loading'
        state.loginError = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginStatus = 'succeeded'
        state.token = action.payload.token ?? null
        state.user = action.payload.user ?? null
        if (action.payload.token) localStorage.setItem('token', action.payload.token)
        if (action.payload.user) localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = 'failed'
        state.loginError = action.payload
        toast.error(action.payload)
      })
      // sendForgotOtp
      .addCase(sendForgotOtp.pending, (state) => {
        state.forgotOtpStatus = 'loading'
        state.forgotOtpError = null
      })
      .addCase(sendForgotOtp.fulfilled, (state) => {
        state.forgotOtpStatus = 'succeeded'
      })
      .addCase(sendForgotOtp.rejected, (state, action) => {
        state.forgotOtpStatus = 'failed'
        state.forgotOtpError = action.payload
        toast.error(action.payload)
      })
      // confirmPassword
      .addCase(confirmPassword.pending, (state) => {
        state.confirmPassStatus = 'loading'
        state.confirmPassError = null
      })
      .addCase(confirmPassword.fulfilled, (state) => {
        state.confirmPassStatus = 'succeeded'
      })
      .addCase(confirmPassword.rejected, (state, action) => {
        state.confirmPassStatus = 'failed'
        state.confirmPassError = action.payload
        toast.error(action.payload)
      })
      // fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.profileStatus = 'loading'
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileStatus = 'succeeded'
        state.user = action.payload
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.profileStatus = 'failed'
      })
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.updateProfileStatus = 'loading'
        state.updateProfileError = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateProfileStatus = 'succeeded'
        if (action.payload) {
          state.user = action.payload
          localStorage.setItem('user', JSON.stringify(action.payload))
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfileStatus = 'failed'
        state.updateProfileError = action.payload
        toast.error(action.payload)
      })
  },
})

export const { setEmail, setRegisterType, resetSendOtp, resetVerifyOtp, resetSendPhoneOtp, resetVerifyPhoneOtp, resetUploadDocs, resetRegister, resetRegisterCompany, resetLogin, logout, resetForgotOtp, resetConfirmPass, resetUpdateProfile } = authSlice.actions
export default authSlice.reducer
