import { useSelector, useDispatch } from 'react-redux'
import { resubmitCase, signDocument } from '../store/slices/caseSlice'
import BackButton from '../components/common/BackButton'
import ESignModal from '../components/cases/ESignModal'
import CoApplicantInvite from '../components/cases/CoApplicantInvite'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function CaseDetail({ caseId, onBack, onDownload }) {
  const dispatch = useDispatch()
  const caseData = useSelector(s => s.case.cases.find(c => c.id === caseId))
  const [showSign, setShowSign] = useState(false)

  if (!caseData) return (
    <div className="text-center py-20">
      <p className="text-gray-400">Case not found.</p>
      <button onClick={onBack} className="mt-4 text-indigo-600 text-sm hover:underline">Go back</button>
    </div>
  )

  const handleResubmit = () => {
    dispatch(resubmitCase(caseId))
    toast.success('Case re-submitted for review')
  }

  const handleSign = () => {
    dispatch(signDocument(caseId))
    setShowSign(false)
    toast.success('Document signed successfully')
  }

  const stageIcon = { done: '✓', active: '●', rejected: '✕', pending: '○' }
  const stageBg = {
    done: 'bg-[#351159] text-white',
    active: 'bg-[#351159] text-white ring-4 ring-purple-200',
    rejected: 'bg-red-500 text-white',
    pending: 'bg-gray-100 text-gray-400',
  }

  return (
    <div className="space-y-5 max-w-2xl w-full pb-10">
      <BackButton onClick={onBack} label="Back to Cases" />

      {/* Header */}
      <div className="bg-[#351159] rounded-2xl p-5 text-white">
        <p className="font-bold text-lg">{caseData.title}</p>
        <p className="text-indigo-200 text-sm mt-0.5">{caseData.advocateName} · {caseData.caseType}</p>
        <p className="text-indigo-200 text-xs mt-1">Case ID: {caseData.id}</p>
      </div>

      {/* Stage Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-semibold text-gray-800 text-sm mb-4">Case Progress</p>
        <div className="space-y-0">
          {caseData.stages.map((stage, i) => (
            <div key={stage.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${stageBg[stage.status]}`}>
                  {stageIcon[stage.status]}
                </div>
                {i < caseData.stages.length - 1 && (
                  <div className={`w-0.5 h-8 ${stage.status === 'done' ? 'bg-indigo-300' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className="pb-6 min-w-0">
                <p className={`text-sm font-semibold ${stage.status === 'pending' ? 'text-gray-400' : stage.status === 'rejected' ? 'text-red-500' : 'text-gray-800'}`}>
                  {stage.label}
                </p>
                {stage.completedAt && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(stage.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
                {stage.status === 'active' && (
                  <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-600 font-medium px-2 py-0.5 rounded-full">In Progress</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rejection */}
      {caseData.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-semibold text-red-600 text-sm">Rejection Reason</p>
          </div>
          <p className="text-sm text-red-600 leading-relaxed">{caseData.rejectionReason}</p>
          <button
            onClick={handleResubmit}
            className="mt-4 btn-primary py-2.5 text-sm w-auto px-5"
          >
            Re-submit Documents
          </button>
        </div>
      )}

      {/* E-Sign */}
      {caseData.currentStage === 'esign' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <p className="font-semibold text-amber-700 text-sm">E-Signature Required</p>
          </div>
          <p className="text-xs text-amber-600 mb-3">Your document is ready for signing. Please add your signature to proceed.</p>
          <button onClick={() => setShowSign(true)} className="btn-primary py-2.5 text-sm w-auto px-5">
            Sign Document
          </button>
        </div>
      )}

      {/* Download Final */}
      {caseData.currentStage === 'completed' && caseData.finalDocumentUrl && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-emerald-700 text-sm">Notarization Complete</p>
            <p className="text-xs text-emerald-600 mt-0.5">Your notarized document is ready to download</p>
          </div>
          <a
            href={caseData.finalDocumentUrl}
            download
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>
        </div>
      )}

      {showSign && <ESignModal onClose={() => setShowSign(false)} onSign={handleSign} />}

      {/* Co-applicants section — shown for multi-party cases */}
      {caseData.isMultiParty && (
        <CoApplicantInvite
          caseId={caseData.id}
          coApplicants={caseData.coApplicants ?? []}
        />
      )}

      {/* Enable multi-party for single-party cases */}
      {!caseData.isMultiParty && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">Multi-party case?</p>
            <p className="text-xs text-gray-400 mt-0.5">Invite a co-applicant (spouse, partner, buyer etc.) to fill their details</p>
          </div>
          <CoApplicantInvite caseId={caseData.id} coApplicants={[]} showAddOnly />
        </div>
      )}
    </div>
  )
}
