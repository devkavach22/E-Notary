import Avatar from '../common/Avatar'
import Badge from '../common/Badge'

export default function ProfileCard({ user, displayName, initials }) {
  const fields = [
    ['Full Name', user.fullName || user.name],
    ['Email', user.email],
    ['Mobile', user.mobile],
    ['Aadhaar', user.aadhaarNumber ? `****${user.aadhaarNumber.slice(-4)}` : '—'],
    ['PAN', user.panNumber || '—'],
    ['City', user.city || '—'],
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 w-full max-w-2xl">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <Avatar initials={initials} size="lg" />
        <div>
          <h2 className="text-lg font-bold text-gray-800">{displayName}</h2>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <div className="mt-1">
            <Badge label="✓ Verified" variant="emerald" />
          </div>
        </div>
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
