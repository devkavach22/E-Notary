import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const stageLabelMap = {
  booked: 'Appointment Booked',
  consultation: 'Video Consultation',
  document_upload: 'Documents Uploaded',
  document_review: 'Document Review',
  template_fill: 'Template Submission',
  esign: 'E-Signature',
  notarization: 'Notarization',
  completed: 'Completed',
  rejected: 'Rejected',
}

const stageColor = {
  done: 'bg-emerald-100 text-emerald-700',
  active: 'bg-indigo-100 text-indigo-700',
  pending: 'bg-gray-100 text-gray-500',
  rejected: 'bg-red-100 text-red-600',
}

export default function InvitedCases({ onFillDetails }) {
  const navigate = useNavigate()
  const user = useSelector(s => s.auth.user)
  const cases = useSelector(s => s.case.cases)

  // Find all cases where this user is a co-applicant (match by email)
  const userEmail = user?.email?.toLowerCase() || ''
  const invitedCases = cases.flatMap(c =>
    (c.coApplicants || [])
      .filter(cop => cop.email?.toLowerCase() === userEmail || cop.status === 'invited' || cop.status === 'submitted')
      .map(cop => ({ ...c, myCop: cop }))
  )

  if (invitedCases.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mb-4">📬</div>
      <p className="font-semibold text-gray-700 text-lg">No invitations yet</p>
      <p className="text-gray-400 text-sm mt-1 max-w-xs">
        When someone invites you to a notarization case, it will appear here.
      </p>
    </div>
  )

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <p className="text-xl font-bold text-gray-900">Invited Cases</p>
        <p className="text-gray-400 text-sm mt-0.5">Cases where you've been invited as a party</p>
      </div>

      {invitedCases.map(({ myCop, ...c }) => {
        const currentStageLabel = stageLabelMap[c.currentStage] || c.currentStage
        const currentStageStatus = c.stages.find(s => s.key === c.currentStage)?.status || 'pending'
        const colorClass = stageColor[currentStageStatus] || stageColor.pending

        return (
          <div key={`${c.id}-${myCop.id}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-base">{c.title}</p>
                  <p className="text-indigo-200 text-xs mt-0.5">{c.advocateName} · {c.category}</p>
                </div>
                <span className="shrink-0 text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-medium">
                  {c.id}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full">
                  Your role: {myCop.role}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-4">

              {/* Case stage */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Current Stage</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>
                  {currentStageLabel}
                </span>
              </div>

              {/* My submission status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">My Details</span>
                {myCop.status === 'submitted' ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    ✓ Submitted
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                    Pending
                  </span>
                )}
              </div>

              {/* Submitted fields preview */}
              {myCop.status === 'submitted' && Object.keys(myCop.fields || {}).length > 0 && (
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-700 mb-2">Your Submitted Details</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(myCop.fields).map(([k, v]) => (
                      <div key={k} className="text-xs">
                        <span className="text-gray-400">{k}: </span>
                        <span className="font-medium text-gray-700">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What first party sent — case documents / stages */}
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-600">Case Progress (sent by case owner)</p>
                </div>
                <div className="px-4 py-3 space-y-2">
                  {c.stages.map(s => (
                    <div key={s.key} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        s.status === 'done' ? 'bg-emerald-500' :
                        s.status === 'active' ? 'bg-indigo-500' :
                        s.status === 'rejected' ? 'bg-red-500' : 'bg-gray-300'
                      }`} />
                      <span className={`text-xs flex-1 ${s.status === 'done' ? 'text-gray-700' : s.status === 'active' ? 'text-indigo-700 font-semibold' : 'text-gray-400'}`}>
                        {s.label}
                      </span>
                      {s.completedAt && (
                        <span className="text-xs text-gray-400">
                          {new Date(s.completedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection reason */}
              {c.rejectionReason && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-red-600 mb-1">Rejection Reason</p>
                  <p className="text-xs text-red-500">{c.rejectionReason}</p>
                </div>
              )}

              {/* Action button */}
              {myCop.status !== 'submitted' && myCop.token && (
                <button
                  onClick={() => navigate(`/join-case?token=${myCop.token}`)}
                  className="btn-primary py-2.5 text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Fill My Details
                </button>
              )}

              {c.finalDocumentUrl && c.finalDocumentUrl !== '#' && (
                <a
                  href={c.finalDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary py-2.5 text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Notarized Document
                </a>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
