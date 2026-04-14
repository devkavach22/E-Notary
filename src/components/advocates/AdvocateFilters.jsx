export default function AdvocateFilters({ caseType, setCaseType, category, setCategory, practiceGroups, categoryOptions }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Filter Advocates</p>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <select
          value={caseType}
          onChange={(e) => { setCaseType(e.target.value); setCategory('') }}
          className="input-field sm:w-auto sm:min-w-[180px]"
        >
          <option value="">All Case Types</option>
          {practiceGroups.map((g) => (
            <option key={g.group} value={g.group}>{g.group}</option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={!caseType}
          className="input-field sm:w-auto sm:min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>

        {(caseType || category) && (
          <button
            onClick={() => { setCaseType(''); setCategory('') }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-2 rounded-xl transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {(caseType || category) && (
        <div className="flex flex-wrap gap-2 mt-3">
          {caseType && (
            <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-medium px-2.5 py-1 rounded-full">
              {caseType}
            </span>
          )}
          {category && (
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-1 rounded-full">
              {category}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
