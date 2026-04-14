export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="bg-red-50 text-red-500 text-sm rounded-xl px-4 py-3 border border-red-100">
      {message}
    </div>
  )
}
