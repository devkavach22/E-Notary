import Spinner from '../common/Spinner'
import ErrorMessage from '../common/ErrorMessage'
import AdvocateFilters from './AdvocateFilters'
import AdvocateCard from './AdvocateCard'

export default function AdvocateList({
  advocates, total, fetchStatus, fetchError,
  caseType, setCaseType, category, setCategory,
  practiceGroups, categoryOptions,
  onBook,
}) {
  return (
    <div className="space-y-5">
      <AdvocateFilters
        caseType={caseType}
        setCaseType={setCaseType}
        category={category}
        setCategory={setCategory}
        practiceGroups={practiceGroups}
        categoryOptions={categoryOptions}
      />

      {fetchStatus === 'loading' && <Spinner text="Loading advocates..." />}
      {fetchStatus === 'failed' && <ErrorMessage message={fetchError} />}

      {fetchStatus === 'succeeded' && (
        <>
          <p className="text-sm text-gray-500">{total} advocate(s) found</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {advocates.map((adv) => (
              <AdvocateCard key={adv._id} adv={adv} onBook={onBook} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
