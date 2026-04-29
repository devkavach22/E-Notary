import { useState } from 'react'
import BackButton from '../common/BackButton'
import NotaryDocPreview from './NotaryDocPreview'

function FieldInput({ f, fieldKey, val, err, isAutoFilled, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {f.fieldName}
        {f.required && <span className="text-red-500 ml-0.5">*</span>}
        {isAutoFilled && <span className="ml-2 text-xs text-emerald-500 font-normal">auto-filled</span>}
      </label>
      {f.fieldType === 'textarea' ? (
        <textarea rows={3} value={val}
          onChange={e => onChange(fieldKey, e.target.value)}
          placeholder={f.placeholder || f.fieldName}
          className={`input-field resize-none ${err ? 'input-error' : ''}`} />
      ) : f.fieldType === 'date' ? (
        <input type="date" value={val}
          onChange={e => onChange(fieldKey, e.target.value)}
          className={`input-field ${err ? 'input-error' : ''}`} />
      ) : f.fieldType === 'select' || f.fieldType === 'dropdown' ? (
        <select value={val}
          onChange={e => onChange(fieldKey, e.target.value)}
          className={`input-field ${err ? 'input-error' : ''}`}>
          <option value="">Select {f.fieldName}</option>
          {(f.options ?? []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : f.fieldType === 'file' ? (
        <label className={`flex items-center gap-3 cursor-pointer border-2 border-dashed rounded-xl px-4 py-3 transition-colors
          ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'}`}>
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span className="text-sm text-gray-500 truncate">
            {val?.name ? val.name : f.placeholder || `Choose file`}
          </span>
          <input type="file" className="hidden" accept="*/*"
            onChange={e => onChange(fieldKey, e.target.files?.[0] ?? null)} />
        </label>
      ) : f.fieldType === 'image' ? (
        <label className={`flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed rounded-xl px-4 py-5 transition-colors
          ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'}`}>
          {val instanceof File ? (
            <img
              src={URL.createObjectURL(val)}
              alt="preview"
              className="h-24 w-auto rounded-lg object-contain"
            />
          ) : (
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          <span className="text-xs text-gray-400">
            {val?.name ? val.name : f.placeholder || 'Click to upload image'}
          </span>
          <input type="file" className="hidden" accept="image/*"
            onChange={e => onChange(fieldKey, e.target.files?.[0] ?? null)} />
        </label>
      ) : (
        <input type={f.fieldType === 'number' ? 'number' : 'text'} value={val ?? ''}
          onChange={e => onChange(fieldKey, e.target.value)}
          placeholder={f.placeholder || f.fieldName}
          className={`input-field ${err ? 'input-error' : ''}`} />
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
}

const GOV_OPTIONS = [
  {
    key: 'central',
    label: 'Central Government',
    sublabel: 'भारत सरकार',
    desc: 'For matters under Union jurisdiction — property transfers, affidavits, central services',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h1v11H4zm15 0h1v11h-1zM9 10h1v11H9zm5 0h1v11h-1z" />
      </svg>
    ),
    color: 'indigo',
    activeBg: 'bg-indigo-600',
    activeBorder: 'border-indigo-600',
    activeText: 'text-white',
    inactiveBorder: 'border-gray-200',
    inactiveText: 'text-gray-700',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  {
    key: 'state',
    label: 'State Government',
    sublabel: 'राज्य सरकार',
    desc: 'For matters under State jurisdiction — local property, regional services, state affidavits',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'emerald',
    activeBg: 'bg-emerald-600',
    activeBorder: 'border-emerald-600',
    activeText: 'text-white',
    inactiveBorder: 'border-gray-200',
    inactiveText: 'text-gray-700',
    badge: 'bg-emerald-100 text-emerald-700',
  },
]

export default function TemplateForm({
  selectedTemplate, formValues, formErrors, fillStatus,
  onBack, onChange, onSubmit, getAutoValue, userData,
}) {
  const [govType, setGovType] = useState('central')

  return (
    <div className="w-full space-y-4">
      <BackButton onClick={onBack} label="Back to Templates" />

      {/* ── Government Type Selector ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Select Document Authority
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GOV_OPTIONS.map(opt => {
            const active = govType === opt.key
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setGovType(opt.key)}
                className={`relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${active
                    ? `${opt.activeBg} ${opt.activeBorder} shadow-md`
                    : `bg-white ${opt.inactiveBorder} hover:border-gray-300`
                  }`}
              >
                {/* Active check */}
                {active && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-white/25 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-white/20 text-white' : `${opt.badge}`}`}>
                  {opt.icon}
                </div>

                {/* Text */}
                <div>
                  <p className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-800'}`}>
                    {opt.label}
                  </p>
                  <p className={`text-xs font-medium mt-0.5 ${active ? 'text-white/80' : 'text-gray-400'}`}>
                    {opt.sublabel}
                  </p>
                  <p className={`text-xs mt-1.5 leading-relaxed ${active ? 'text-white/70' : 'text-gray-400'}`}>
                    {opt.desc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Info strip */}
        <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
          ${govType === 'central' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {govType === 'central'
            ? 'Central Govt. stamp paper is valid across all states of India.'
            : 'State Govt. stamp paper is valid only within the issuing state.'}
        </div>
      </div>

      {/* ── Split layout: form left, live preview right ── */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">

        {/* LEFT — Form */}
        <div className="w-full xl:w-[420px] shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="mb-4">
              <p className="font-bold text-gray-800 text-base">{selectedTemplate.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{selectedTemplate.description}</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Top-level fields */}
              {(selectedTemplate.fields ?? []).map((f) => (
                <FieldInput
                  key={f.fieldName}
                  f={f}
                  fieldKey={f.fieldName}
                  val={formValues[f.fieldName] ?? ''}
                  err={formErrors[f.fieldName]}
                  isAutoFilled={!!getAutoValue(f.fieldName, userData)}
                  onChange={onChange}
                />
              ))}

              {/* Party sections */}
              {(selectedTemplate.parties ?? []).map((party) => (
                <div key={party.partyName} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{party.partyName}</p>
                  {party.fields.map((f) => {
                    const key = `${party.partyName} - ${f.fieldName}`
                    return (
                      <FieldInput
                        key={key}
                        f={f}
                        fieldKey={key}
                        val={formValues[key] ?? ''}
                        err={formErrors[key]}
                        isAutoFilled={!!getAutoValue(f.fieldName, userData)}
                        onChange={onChange}
                      />
                    )
                  })}
                </div>
              ))}

              <button type="submit" disabled={fillStatus === 'loading'}
                className="btn-primary py-2.5 text-sm mt-2 flex items-center justify-center gap-2 w-auto px-6">
                {fillStatus === 'loading' ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview & Proceed
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT — Live document preview */}
        <div className="flex-1 min-w-0">
          <div className="sticky top-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Live Document Preview
              </p>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${govType === 'central' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {govType === 'central' ? '🏛 Central Govt.' : '📍 State Govt.'}
              </span>
            </div>
            <NotaryDocPreview
              selectedTemplate={selectedTemplate}
              formValues={formValues}
              templatesMeta={{}}
              govType={govType}
              preview
            />
          </div>
        </div>

      </div>
    </div>
  )
}
