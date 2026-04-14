const actions = [
  { icon: '🔍', label: 'Find an Advocate', desc: 'Browse and filter verified advocates', nav: 'advocates' },
  { icon: '📅', label: 'My Bookings', desc: 'View and manage your appointments', nav: 'bookings' },
  { icon: '📁', label: 'My Cases', desc: 'Track your case stages in real time', nav: 'cases' },
  { icon: '🔔', label: 'Notifications', desc: 'Stay updated on case changes', nav: 'notifications' },
]

export default function QuickActions({ onNavigate }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.nav)}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all duration-200 flex items-start gap-4 text-left"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center text-xl shrink-0">
              {item.icon}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
