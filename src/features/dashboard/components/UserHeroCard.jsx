// UserHeroCard.jsx
export default function UserHeroCard({
  profile,
  hasClockedInToday,
  attendanceMessage,
  onOpenFaq,
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-green-900 p-8 text-white shadow-xl shadow-green-900/10">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome, {profile.name}
          </h2>
          <p className="mt-1 text-green-100 font-medium opacity-90">
            {profile.role} • {profile.department}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm border ${
              hasClockedInToday
                ? "bg-green-500 text-white border-green-400"
                : "bg-white/10 text-white border-white/20 backdrop-blur-md"
            }`}
          >
            {hasClockedInToday ? "Clocked In" : "Not Clocked In Today"}
          </span>
        </div>
      </div>

      {attendanceMessage && (
        <div className="mt-6 inline-block rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-yellow-200 border border-white/10 backdrop-blur-sm">
          {attendanceMessage}
        </div>
      )}

      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-green-800/50 blur-3xl pointer-events-none" />
    </div>
  );
}
