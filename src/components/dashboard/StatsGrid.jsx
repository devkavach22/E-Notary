const stats = [
  { label: 'Total Documents', value: '0', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: '📄' },
  { label: 'Pending', value: '0', color: 'text-amber-600', bg: 'bg-amber-50', icon: '⏳' },
  { label: 'Completed', value: '0', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✅' },
  { label: 'Rejected', value: '0', color: 'text-red-500', bg: 'bg-red-50', icon: '❌' },
]

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 flex items-center gap-3`}>
          <span className="text-2xl">{stat.icon}</span>
          <div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
