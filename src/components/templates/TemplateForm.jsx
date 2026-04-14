import BackButton from '../common/BackButton'

export default function TemplateForm({ selectedTemplate, formValues, formErrors, fillStatus, onBack, onChange, onSubmit, getAutoValue, userData }) {
  return (
    <div className="w-full max-w-xl space-y-5">
      <BackButton onClick={onBack} label="Back to Templates" />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-semibold text-gray-800 mb-0.5">{selectedTemplate.title}</p>
        <p className="text-xs text-gray-400 mb-5">{selectedTemplate.description}</p>

        <form onSubmit={onSubmit} className="space-y-4">
          {selectedTemplate.fields.map((f) => {
            const val = formValues[f.fieldName] ?? ''
            const err = formErrors[f.fieldName]
            const isAutoFilled = !!getAutoValue(f.fieldName, userData)

            return (
              <div key={f.fieldName}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {f.fieldName}
                  {f.required && <span className="text-red-500 ml-0.5">*</span>}
                  {isAutoFilled && <span className="ml-2 text-xs text-emerald-500 font-normal">auto-filled</span>}
                </label>

                {f.fieldType === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={val}
                    onChange={(e) => onChange(f.fieldName, e.target.value)}
                    placeholder={f.placeholder || f.fieldName}
                    className={`input-field resize-none ${err ? 'input-error' : ''}`}
                  />
                ) : f.fieldType === 'date' ? (
                  <input
                    type="date"
                    value={val}
                    onChange={(e) => onChange(f.fieldName, e.target.value)}
                    className={`input-field ${err ? 'input-error' : ''}`}
                  />
                ) : f.fieldType === 'select' ? (
                  <select
                    value={val}
                    onChange={(e) => onChange(f.fieldName, e.target.value)}
                    className={`input-field ${err ? 'input-error' : ''}`}
                  >
                    <option value="">Select {f.fieldName}</option>
                    {(f.options ?? []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.fieldType === 'number' ? 'number' : 'text'}
                    value={val}
                    onChange={(e) => onChange(f.fieldName, e.target.value)}
                    placeholder={f.placeholder || f.fieldName}
                    className={`input-field ${err ? 'input-error' : ''}`}
                  />
                )}

                {err && (
                  <p className="error-msg mt-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {err}
                  </p>
                )}
              </div>
            )
          })}

          <button
            type="submit"
            disabled={fillStatus === 'loading'}
            className="btn-primary py-2.5 text-sm mt-2 flex items-center justify-center gap-2 w-auto px-4"
          >
            {fillStatus === 'loading' ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Submitting...
              </>
            ) : 'Preview Application'}
          </button>
        </form>
      </div>
    </div>
  )
}
