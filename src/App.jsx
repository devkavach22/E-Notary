import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import EmailVerify from './pages/EmailVerify'
import EmailOtpVerify from './pages/EmailOtpVerify'
import MobileVerify from './pages/MobileVerify'
import UploadDocuments from './pages/UploadDocuments'
import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Navigate to="/verify-email" />} />
        <Route path="/verify-email" element={<EmailVerify />} />
        <Route path="/verify-email-otp" element={<EmailOtpVerify />} />
        <Route path="/verify-mobile" element={<MobileVerify />} />
        <Route path="/upload-documents" element={<UploadDocuments />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
