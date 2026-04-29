import { useState } from 'react'
import BackButton from '../common/BackButton'
import Badge from '../common/Badge'
import Spinner from '../common/Spinner'
import ErrorMessage from '../common/ErrorMessage'

export default function TemplateList({ templates, templatesMeta, templatesStatus, templatesError, onBack, onSelect }) {
  const [search, setSearch] = useState('')

  const filtered = (templates ?? []).filter((tpl) =>
    tpl.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <BackButton onClick={onBack} label="Back to Advocates" />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-sm font-semibold text-gray-700">
          Advocate: <span className="text-indigo-600">{templatesMeta.advocateName}</span>
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {templatesMeta.filterApplied?.practiceArea && (
            <Badge label={templatesMeta.filterApplied.practiceArea} variant="indigo" />
          )}
          {templatesMeta.filterApplied?.category && (
            <Badge label={templatesMeta.filterApplied.category} variant="purple" />
          )}
        </div>
      </div>

      {/* Template name search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search template by name..."
          className="input-field pl-9 pr-9 w-full"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {templatesStatus === 'loading' && <Spinner text="Loading templates..." />}
      {templatesStatus === 'failed' && <ErrorMessage message={templatesError} />}

      {templatesStatus === 'succeeded' && templates.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No templates available.</p>
        </div>
      )}

      {templatesStatus === 'succeeded' && templates.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No templates match "{search}".</p>
        </div>
      )}

      {templatesStatus === 'succeeded' && filtered.map((tpl) => (
        <div key={tpl._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all duration-200 p-5">
          <p className="font-semibold text-gray-800 mb-1">{tpl.title}</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge label={tpl.practiceArea} variant="indigo" />
            <Badge label={tpl.category} variant="purple" />
            <Badge label={tpl.caseType} variant="gray" />
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">{tpl.description}</p>
          <button onClick={() => onSelect(tpl)} className="btn-primary py-2 text-sm w-auto px-4">
            Use This Template
          </button>
        </div>
      ))}
    </div>
  )
}
