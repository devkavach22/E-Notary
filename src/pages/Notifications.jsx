import { useSelector, useDispatch } from 'react-redux'
import { markNotificationRead, markAllRead } from '../store/slices/caseSlice'

const typeIcon = {
  stage_change: { icon: '🔄', bg: 'bg-purple-50', text: 'text-purple-600' },
  rejection: { icon: '❌', bg: 'bg-red-50', text: 'text-red-500' },
  booking: { icon: '📅', bg: 'bg-indigo-50', text: 'text-indigo-600' },
  completed: { icon: '✅', bg: 'bg-emerald-50', text: 'text-emerald-600' },
}

export default function Notifications({ onViewCase }) {
  const dispatch = useDispatch()
  const notifications = useSelector(s => s.case.notifications)
  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-gray-800">Notifications</p>
          <p className="text-xs text-gray-400 mt-0.5">{unread} unread</p>
        </div>
        {unread > 0 && (
          <button
            onClick={() => dispatch(markAllRead())}
            className="text-xs text-indigo-600 font-medium hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mb-4">🔔</div>
          <p className="text-gray-700 font-semibold">No notifications</p>
          <p className="text-gray-400 text-sm mt-1">You're all caught up</p>
        </div>
      )}

      <div className="space-y-2">
        {notifications.map(n => {
          const meta = typeIcon[n.type] ?? typeIcon.stage_change
          return (
            <div
              key={n.id}
              onClick={() => {
                dispatch(markNotificationRead(n.id))
                if (n.caseId) onViewCase?.(n.caseId)
              }}
              className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-sm ${n.read ? 'bg-white border-gray-100' : 'bg-indigo-50/50 border-indigo-100'}`}
            >
              <div className={`w-9 h-9 ${meta.bg} rounded-xl flex items-center justify-center text-lg shrink-0`}>
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>{n.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
