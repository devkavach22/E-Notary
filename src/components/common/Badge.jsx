// variant: 'indigo' | 'purple' | 'gray' | 'emerald'
const variants = {
  indigo: 'bg-indigo-50 text-indigo-600',
  purple: 'bg-purple-50 text-purple-600',
  gray: 'bg-gray-100 text-gray-500',
  emerald: 'bg-emerald-50 text-emerald-600',
}

export default function Badge({ label, variant = 'indigo' }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${variants[variant]}`}>
      {label}
    </span>
  )
}
