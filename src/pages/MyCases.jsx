import { useSelector } from 'react-redux'
import Badge from '../components/common/Badge'

const stageLabels = {
  booked: 'Booked',
  consultation: 'Consultation',
  document_upload: 'Docs Upload',
  document_review: 'Doc Review',
  template_fill: 'Template',
  esign: 'E-Sign',
  notarization: 'Notarization',
  completed: 'Completed',
  rejected: 'Rejected',
}

const stageVariant = {
  done: 'indigo',
  active: 'purple',
  pending: 'gray',
  rejected: 'red',
}

export default function MyCases({ onViewCase }) {
  const cases = useSelector(s => s.case.cases)

  return (
    <div className="space-y-5">
      <div>
        <p className="text-lg font-bold text-gray-800">My Cases</p>
        <p className="text-xs text-gray-400 mt-0.5">{cases.length} case(s) total</p>
      </div>

      {cases.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mb-4">📁</div>
          <p className="text-gray-700 font-semibold">No cases yet</p>
          <p className="text-gray-400 text-sm mt-1">Your cases will appear here after booking</p>
        </div>
      )}

      <div className="space-y-4">
        {cases.map(c => {
          const activeStage = c.stages.find(s => s.status === 'active' || s.status === 'rejected')
          const progress = c.stages.filter(s => s.status === 'done').length
          const total = c.stages.length

          return (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{c.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.advocateName} · {c.caseType}</p>
                </div>
                <Badge
                  label={c.currentStage === 'rejected' ? 'Rejected' : c.currentStage === 'completed' ? 'Completed' : 'In Progress'}
                  variant={c.currentStage === 'rejected' ? 'red' : c.currentStage === 'completed' ? 'indigo' : 'purple'}
                />
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                  <span>Progress</span>
                  <span>{progress}/{total} stages</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(progress / total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Stage pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {c.stages.map(s => (
                  <span
                    key={s.key}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      s.status === 'done' ? 'bg-indigo-100 text-indigo-600' :
                      s.status === 'active' ? 'bg-purple-100 text-purple-600 ring-1 ring-purple-300' :
                      s.status === 'rejected' ? 'bg-red-100 text-red-500' :
                      'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {s.status === 'done' ? '✓ ' : s.status === 'active' ? '● ' : ''}{s.label}
                  </span>
                ))}
              </div>

              {c.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 text-xs text-red-600">
                  <span className="font-semibold">Rejection: </span>{c.rejectionReason}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => onViewCase(c.id)}
                  className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-medium px-3 py-2 rounded-xl transition-all"
                >
                  View Details
                </button>
                {c.finalDocumentUrl && c.finalDocumentUrl !== '#' && (
                  <a
                    href={c.finalDocumentUrl}
                    download
                    className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-medium px-3 py-2 rounded-xl transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
