export default function AuthLayout({ children, step, totalSteps, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              E-Notary
            </span>
          </div>
          <p className="text-gray-500 text-sm">Secure Digital Notarization Platform</p>
        </div>

        {/* Progress Steps */}
        {step && totalSteps && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${i + 1 < step ? 'bg-green-500 text-white' :
                    i + 1 === step ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md' :
                    'bg-gray-200 text-gray-400'}`}>
                  {i + 1 < step ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-8 h-0.5 ${i + 1 < step ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="auth-card">
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
