import { navItems } from './Sidebar'
import Avatar from '../common/Avatar'
import { useSelector, useDispatch } from 'react-redux'
import { markAllRead } from '../../store/slices/caseSlice'

export default function Topbar({ activeNav, setSidebarOpen, selectedTemplate, displayName, initials, onNavigate }) {
  const unreadCount = useSelector(s => s.case.notifications.filter(n => !n.read).length)

  const pageTitle =
    activeNav === 'templates' ? 'Select Template' :
    activeNav === 'form' ? selectedTemplate?.title ?? 'Fill Application' :
    activeNav === 'stamp' ? 'Application Document' :
    activeNav === 'bookings' ? 'My Bookings' :
    activeNav === 'booking-detail' ? 'Booking Details' :
    activeNav === 'upload-case-docs' ? 'Upload Documents' :
    activeNav === 'cases' ? 'My Cases' :
    activeNav === 'notifications' ? 'Notifications' :
    activeNav === 'payment' ? 'Payment' :
    navItems.find(n => n.key === activeNav)?.label ?? 'Dashboard'

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10 px-4 py-3 flex items-center justify-between lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-semibold text-gray-800">{pageTitle}</h1>
          <p className="text-xs text-gray-400 hidden sm:block">E-Notary Platform</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate?.('notifications')}
          className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <Avatar initials={initials} size="sm" />
        <span className="text-sm font-medium text-gray-700 hidden sm:block">{displayName}</span>
      </div>
    </header>
  )
}
