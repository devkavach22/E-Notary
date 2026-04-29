import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile } from '../../store/slices/authSlice'
import Avatar from '../common/Avatar'
import Badge from '../common/Badge'
import Spinner from '../common/Spinner'

export default function ProfileCard({ onEdit }) {
  const dispatch = useDispatch()
  const { user, profileStatus } = useSelector(s => s.auth)

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  if (profileStatus === 'loading' || !user) {
    return <div className="flex justify-center py-20"><Spinner /></div>
  }

  const displayName = user.fullName || user.name || user.email || 'User'
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const fields = [
    ['Full Name', user.fullName],
    ['Email', user.email],
    ['Mobile', user.mobile],
    ['Date of Birth', user.dateOfBirth ? user.dateOfBirth.split('T')[0] : null],
    ['Gender', user.gender],
    ['Aadhaar', user.aadhaarNumber ? `****${user.aadhaarNumber.slice(-4)}` : null],
    ['PAN', user.panNumber],
    ['Address', user.address],
    ['City', user.city],
    ['State', user.state],
    ['Pincode', user.pincode],
    
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 w-full max-w-7xl">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <Avatar initials={initials} size="lg" />
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-800">{displayName}</h2>
          <p className="text-sm text-gray-400">{user.email}</p>
          <div className="flex gap-2 mt-1">
            {user.isEmailVerified && <Badge label="✓ Email Verified" variant="emerald" />}
            {user.isMobileVerified && <Badge label="✓ Mobile Verified" variant="indigo" />}
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map(([label, value]) => value ? (
          <div key={label} className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-700 truncate">{value}</p>
          </div>
        ) : null)}
      </div>
    </div>
  )
}
