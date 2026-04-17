import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { sendCoApplicantInvite, addCoApplicant } from '../../store/slices/caseSlice'
import { toast } from 'react-toastify'

const statusMeta = {
  pending:   { label: 'Not Invited',  bg: 'bg-gray-100',    text: 'text-gray-500',   dot: 'bg-gray-400'   },
  invited:   { label: 'Invite Sent',  bg: 'bg-amber-50',    text: 'text-amber-600',  dot: 'bg-amber-400'  },
  submitted: { label: 'Submitted',    bg: 'bg-emerald-50',  text: 'text-emerald-600',dot: 'bg-emerald-400'},
}

export default function CoApplicantInvite({ caseId, coApplicants = [], showAddOnly = false }) {
  const dispatch = useDispatch()
  const [openId, setOpenId]   = useState(null)   // which cop panel is expanded
  const [email, setEmail]     = useState('')
  const [mobile, setMobile]   = useState('')
  const [shareMethod, setShareMethod] = useState('email') // 'email' | 'link' | 'whatsapp'
  const [newRole, setNewRole] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [copied, setCopied]   = useState(null)

  const baseUrl = window.location.origin

  // showAddOnly mode — just the add button for single-party cases
  if (showAddOnly) return (
    <button
      onClick={() => { dispatch(addCoApplicant({ caseId, role: 'Co-Applicant' })); toast.success('Co-applicant section enabled') }}
      className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-all shrink-0"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Enable
    </button>
  )

  const getLink = (token) => `${baseUrl}/join-case?token=${token}`

  const handleCopy = (token) => {
    navigator.clipboard.writeText(getLink(token))
    setCopied(token)
    toast.success('Link copied to clipboard')
    setTimeout(() => setCopied(null), 2000)
  }

  const handleWhatsApp = (cop) => {
    const link = getLink(cop.token)
    const msg = encodeURIComponent(
      `Hi, you have been invited as "${cop.role}" for a notarization case.\n\nPlease fill your details here:\n${link}\n\nThis link is valid for 48 hours.`
    )
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  const handleSendInvite = (cop) => {
    if (shareMethod === 'email' && !email.trim()) { toast.error('Enter email address'); return }
    if (shareMethod === 'whatsapp' && !mobile.trim()) { toast.error('Enter mobile number'); return }
    dispatch(sendCoApplicantInvite({
      caseId,
      coApplicantId: cop.id,
      email: shareMethod === 'email' ? email : '',
      mobile: shareMethod === 'whatsapp' ? mobile : '',
    }))
    if (shareMethod === 'whatsapp') handleWhatsApp({ ...cop, mobile })
    toast.success(`Invite sent to ${shareMethod === 'email' ? email : mobile}`)
    setEmail(''); setMobile(''); setOpenId(null)
  }

  const handleAddParty = () => {
    if (!newRole.trim()) { toast.error('Enter a role for the new party'); return }
    dispatch(addCoApplicant({ caseId, role: newRole.trim() }))
    toast.success(`"${newRole}" added as co-applicant`)
    setNewRole(''); setShowAdd(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Co-Applicants</p>
            <p className="text-xs text-gray-400">Invite other parties to fill their details</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Party
        </button>
      </div>

      {/* Add new party */}
      {showAdd && (
        <div className="bg-indigo-50 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-indigo-700">Add a new party to this case</p>
          <input
            type="text"
            value={newRole}
            onChange={e => setNewRole(e.target.value)}
            placeholder="e.g. Wife, Buyer, Second Partner..."
            className="input-field text-sm"
          />
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="btn-secondary py-2 text-xs w-auto px-4">Cancel</button>
            <button onClick={handleAddParty} className="btn-primary py-2 text-xs w-auto px-4">Add</button>
          </div>
        </div>
      )}

      {/* Co-applicant list */}
      {coApplicants.length === 0 && !showAdd && (
        <div className="text-center py-6">
          <p className="text-gray-400 text-sm">No co-applicants added yet.</p>
          <p className="text-gray-300 text-xs mt-0.5">Click "Add Party" to invite someone.</p>
        </div>
      )}

      <div className="space-y-3">
        {coApplicants.map(cop => {
          const meta = statusMeta[cop.status] ?? statusMeta.pending
          const isOpen = openId === cop.id
          const link = getLink(cop.token)

          return (
            <div key={cop.id} className="border border-gray-100 rounded-xl overflow-hidden">

              {/* Row */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {cop.role?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{cop.role}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {cop.email || cop.mobile || 'Not contacted yet'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${meta.bg} ${meta.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                  {cop.status !== 'submitted' && (
                    <button
                      onClick={() => { setOpenId(isOpen ? null : cop.id); setEmail(''); setMobile('') }}
                      className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl font-medium transition-all"
                    >
                      {isOpen ? 'Close' : 'Invite'}
                    </button>
                  )}
                </div>
              </div>

              {/* Submitted fields preview */}
              {cop.status === 'submitted' && Object.keys(cop.fields).length > 0 && (
                <div className="px-4 py-3 bg-emerald-50 border-t border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-700 mb-2">Submitted Details</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(cop.fields).map(([k, v]) => (
                      <div key={k} className="text-xs">
                        <span className="text-gray-400">{k}: </span>
                        <span className="font-medium text-gray-700">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invite panel */}
              {isOpen && (
                <div className="px-4 py-4 border-t border-gray-100 space-y-4 bg-white">

                  {/* Share method tabs */}
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    {[
                      { key: 'email',    label: '✉️ Email'    },
                      { key: 'whatsapp', label: '💬 WhatsApp' },
                      { key: 'link',     label: '🔗 Copy Link'},
                    ].map(m => (
                      <button
                        key={m.key}
                        onClick={() => setShareMethod(m.key)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${shareMethod === m.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {shareMethod === 'email' && (
                    <div className="space-y-2">
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter co-applicant's email"
                        className="input-field text-sm"
                      />
                      <button onClick={() => handleSendInvite(cop)} className="btn-primary py-2 text-sm w-auto px-5">
                        Send Email Invite
                      </button>
                    </div>
                  )}

                  {shareMethod === 'whatsapp' && (
                    <div className="space-y-2">
                      <input
                        type="tel"
                        value={mobile}
                        onChange={e => setMobile(e.target.value)}
                        placeholder="Enter mobile number (with country code)"
                        className="input-field text-sm"
                      />
                      <button
                        onClick={() => handleSendInvite(cop)}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-2 px-5 rounded-xl transition-all w-auto"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Send via WhatsApp
                      </button>
                    </div>
                  )}

                  {shareMethod === 'link' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span className="text-xs text-gray-500 truncate flex-1">{link}</span>
                        <button
                          onClick={() => handleCopy(cop.token)}
                          className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-lg transition-all ${copied === cop.token ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
                        >
                          {copied === cop.token ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">Share this link with the co-applicant. Valid for 48 hours.</p>
                    </div>
                  )}

                  {/* Expiry note */}
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Invite link expires in 48 hours. Co-applicant does not need an account.
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
