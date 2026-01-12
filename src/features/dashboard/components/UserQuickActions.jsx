// UserQuickActions.jsx
export default function UserQuickActions({
  quickActions,
  clockLoading,
  hasClockedInToday,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {quickActions.map((action) => {
        const disabled =
          clockLoading || (action.isClockAction && hasClockedInToday);

        return (
          <button
            key={action.label}
            onClick={action.onClick}
            disabled={disabled}
            className={`group relative flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-bold shadow-md transition-all transform active:scale-95 ${
              disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#fbbf24] text-green-950 hover:bg-[#f59e0b] hover:shadow-lg hover:-translate-y-0.5"
            }`}
          >
            <span className="opacity-80 group-hover:opacity-100 transition-opacity">
              {action.icon}
            </span>
            <span>
              {clockLoading && action.isClockAction
                ? "Processing..."
                : action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
