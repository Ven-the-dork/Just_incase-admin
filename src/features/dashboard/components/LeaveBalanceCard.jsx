// LeaveBalanceCard.jsx
import { Calendar } from "lucide-react";

export default function LeaveBalanceCard({
  leaveOptions,
  leaveBalances,
  loadingLeaves,
}) {
  return (
    <div className="rounded-3xl bg-white shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
      <div className="bg-[#064e3b] px-6 py-5 border-b border-green-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">
              Available Leave Days
            </h3>
            <p className="text-xs text-green-200/80 mt-0.5">
              Balances include pending + approved requests.
            </p>
          </div>
          <div className="p-2 bg-green-800 rounded-lg">
            <Calendar className="text-green-200" size={20} />
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {loadingLeaves ? (
          <div className="py-8 text-center text-gray-500 animate-pulse">
            Loading balances...
          </div>
        ) : leaveOptions.length === 0 ? (
          <div className="py-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No leave plans available.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {leaveOptions.map((plan) => {
              const remaining = leaveBalances[plan.id] ?? plan.days;
              const used = plan.days - remaining;
              const percent = plan.days > 0 ? (used / plan.days) * 100 : 0;

              return (
                <ProgressBar
                  key={plan.id}
                  label={plan.label}
                  remaining={remaining}
                  total={plan.days}
                  percent={percent}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ label, remaining, total, percent }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-gray-900 font-bold text-sm">{label}</span>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
          {remaining} days left
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-600 to-green-500 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${100 - percent}%` }}
        />
      </div>
    </div>
  );
}
