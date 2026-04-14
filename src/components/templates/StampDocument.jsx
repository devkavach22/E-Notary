export default function StampDocument({ selectedTemplate, formValues, templatesMeta, onEditForm, onDownload, downloadStatus, submissionId, submissionStatus }) {
  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* <button
        onClick={onEditForm}
        className="flex items-center gap-1.5 text-sm text-indigo-600 font-medium hover:underline"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Edit Form
      </button> */}

      <div className="border-2 border-indigo-200 rounded-2xl overflow-hidden text-xs">
        <div className="bg-[#351159] text-white px-5 py-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-wide">E-Notary</span>
          </div>
          <p className="text-indigo-200 text-xs">Digital Notarization Platform</p>
          <p className="text-white font-bold text-sm mt-1 uppercase tracking-widest">
            {selectedTemplate.caseType} — Application Form
          </p>
        </div>

        {/* Meta rows */}
        <div className="grid grid-cols-2 border-b border-indigo-100">
          <div className="border-r border-indigo-100 px-4 py-2.5">
            <p className="text-gray-400">Practice Area</p>
            <p className="font-semibold text-gray-700 mt-0.5">{selectedTemplate.practiceArea}</p>
          </div>
          <div className="px-4 py-2.5">
            <p className="text-gray-400">Category</p>
            <p className="font-semibold text-gray-700 mt-0.5">{selectedTemplate.category}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 border-b border-indigo-100">
          <div className="border-r border-indigo-100 px-4 py-2.5">
            <p className="text-gray-400">Application Date</p>
            <p className="font-semibold text-gray-700 mt-0.5">{new Date().toLocaleDateString('en-IN')}</p>
          </div>
          <div className="px-4 py-2.5">
            <p className="text-gray-400">Advocate</p>
            <p className="font-semibold text-indigo-600 mt-0.5">{templatesMeta.advocateName}</p>
          </div>
        </div>

        {/* Title & description */}
        <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-1.5 text-center">
          <span className="font-bold text-indigo-700 uppercase tracking-wider">{selectedTemplate.title}</span>
        </div>
        <div className="px-4 py-2.5 border-b border-indigo-100 bg-white">
          <p className="text-gray-500 leading-relaxed">{selectedTemplate.description}</p>
        </div>

        {/* Fields */}
        <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-1.5 text-center">
          <span className="font-bold text-indigo-700 uppercase tracking-wider">Applicant Details</span>
        </div>
        {selectedTemplate.fields.map((f, i) => (
          <div key={f.fieldName} className={`flex border-b border-indigo-100 ${i % 2 === 0 ? 'bg-white' : 'bg-indigo-50/30'}`}>
            <div className="w-28 sm:w-40 shrink-0 px-3 sm:px-4 py-2.5 border-r border-indigo-100">
              <span className="text-gray-500 break-words">
                {f.fieldName}{f.required && <span className="text-red-400 ml-0.5">*</span>}
              </span>
            </div>
            <div className="flex-1 px-3 sm:px-4 py-2.5 min-w-0">
              <span className={`font-semibold break-words ${formValues[f.fieldName] ? 'text-gray-800' : 'text-gray-300 italic'}`}>
                {formValues[f.fieldName] || '—'}
              </span>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-200 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-indigo-400 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-indigo-700 font-bold">E-Notary Verified</p>
              <p className="text-gray-400">{new Date().toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-gray-400">Document ID</p>
            <p className="text-indigo-600 font-bold">{selectedTemplate._id.slice(-8).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {submissionId && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-700">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Submission accepted</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500 flex-wrap">
            <span>ID: <span className="font-bold text-emerald-700">{submissionId.slice(-8).toUpperCase()}</span></span>
            {submissionStatus && (
              <span className="bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full capitalize">
                {submissionStatus}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {/* <button onClick={onEditForm} className="btn-secondary flex-1 py-2 text-sm">Edit Form</button> */}
        <button
          onClick={onDownload}
          disabled={downloadStatus === 'loading'}
          className="btn-primary w-auto px-4 py-2 text-sm flex items-center justify-center gap-2"
        >
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
              Download
            </>
          )}
        </button>
      </div>
    </div>
  )
}
