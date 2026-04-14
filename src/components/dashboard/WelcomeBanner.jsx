export default function WelcomeBanner({ displayName }) {
  return (
    <div className="bg-[#351159] rounded-2xl p-6 text-white shadow-lg shadow-indigo-200/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back 👋</p>
          <h2 className="text-xl sm:text-2xl font-bold">{displayName}</h2>
          <p className="text-indigo-200 text-sm mt-1">Manage your digital notarizations securely</p>
        </div>
        <div className="hidden sm:flex w-16 h-16 bg-white/20 rounded-2xl items-center justify-center text-3xl">
          📜
        </div>
      </div>
    </div>
  )
}
