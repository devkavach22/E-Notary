import NotaryDocPreview from './NotaryDocPreview'

export default function StampDocument({ selectedTemplate, formValues, templatesMeta, onEditForm, onDownload, downloadStatus, submissionId, submissionStatus, paid = false, onProceedPayment }) {
  return (
    <div className="w-full space-y-5">

      {/* Status banner */}
      {paid ? (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3">
          <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-bold text-emerald-700 text-sm">Payment Successful — Document Notarized</p>
            <p className="text-xs text-emerald-600 mt-0.5">Your official notarized document is ready below</p>
          </div>
          {submissionId && (
            <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full">
              ID: {submissionId.slice(-8).toUpperCase()}
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3">
          <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-bold text-amber-700 text-sm">Document Preview — Payment Required</p>
            <p className="text-xs text-amber-600 mt-0.5">Complete payment to get the official notary stamp</p>
          </div>
        </div>
      )}

      {/* Document */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <NotaryDocPreview
          selectedTemplate={selectedTemplate}
          formValues={formValues}
          templatesMeta={templatesMeta}
          paid={paid}
          preview={false}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button onClick={onEditForm}
          className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Details
        </button>

        {!paid && (
          <button onClick={onProceedPayment}
            className="btn-primary w-auto px-6 py-2.5 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Proceed to Payment
          </button>
        )}

        {paid && (
          <button onClick={onDownload} disabled={downloadStatus === 'loading'}
            className="btn-primary w-auto px-6 py-2.5 text-sm flex items-center gap-2">
            {downloadStatus === 'loading' ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Notarized Document
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
