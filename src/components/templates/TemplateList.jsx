import BackButton from '../common/BackButton'
import Badge from '../common/Badge'
import Spinner from '../common/Spinner'
import ErrorMessage from '../common/ErrorMessage'

export default function TemplateList({ templates, templatesMeta, templatesStatus, templatesError, onBack, onSelect }) {
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

      {templatesStatus === 'loading' && <Spinner text="Loading templates..." />}
      {templatesStatus === 'failed' && <ErrorMessage message={templatesError} />}
      {templatesStatus === 'succeeded' && templates.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No templates available.</p>
        </div>
      )}

      {templatesStatus === 'succeeded' && templates.map((tpl) => (
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
