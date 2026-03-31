import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'

const menuItems = [
  { icon: '📄', label: 'My Documents', desc: 'View and manage your notarized documents' },
  { icon: '✍️', label: 'New Notarization', desc: 'Start a new document notarization request' },
  { icon: '📋', label: 'Pending Requests', desc: 'Track your pending notarization requests' },
  { icon: '✅', label: 'Completed', desc: 'View all completed notarizations' },
]

export default function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((s) => s.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const displayName = user?.fullName || user?.name || user?.email || 'User'
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              E-Notary
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{displayName}</p>
              <p className="text-xs text-gray-400">{user?.email || ''}</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back 👋</p>
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <p className="text-indigo-200 text-sm mt-1">Manage your digital notarizations securely</p>
            </div>
            <div className="hidden sm:flex w-16 h-16 bg-white/20 rounded-2xl items-center justify-center text-3xl">
              📜
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Documents', value: '0', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Pending', value: '0', color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Completed', value: '0', color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Rejected', value: '0', color: 'text-red-600', bg: 'bg-red-50' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-4`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all duration-200 flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Info */}
        {user && (
          <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Your Profile</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                ['Full Name', user.fullName || user.name],
                ['Email', user.email],
                ['Mobile', user.mobile],
                ['Aadhaar', user.aadhaarNumber ? `****${user.aadhaarNumber.slice(-4)}` : '—'],
                ['PAN', user.panNumber || '—'],
                ['City', user.city || '—'],
              ].map(([label, value]) => value ? (
                <div key={label}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5 truncate">{value}</p>
                </div>
              ) : null)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
