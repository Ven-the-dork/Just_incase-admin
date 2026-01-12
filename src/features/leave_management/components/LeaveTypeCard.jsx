// src/features/leave/components/LeaveTypeCard.jsx
import { FileText } from "lucide-react";

export default function LeaveTypeCard({ days, label, remaining, onApply }) {
  const balance = remaining !== undefined ? remaining : days;
  const isExhausted = balance === 0;

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isExhausted
          ? "bg-gray-100 border border-gray-200"
          : "bg-gradient-to-br from-green-800 to-green-900 border border-green-700 shadow-xl shadow-green-900/20"
      }`}
    >
      {!isExhausted && (
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-yellow-400/10 blur-2xl group-hover:bg-yellow-400/20 transition-all duration-500" />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-2 rounded-xl ${
              isExhausted ? "bg-gray-200" : "bg-white/10"
            }`}
          >
            <FileText
              className={isExhausted ? "text-gray-400" : "text-yellow-300"}
              size={24}
            />
          </div>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isExhausted ? "text-gray-400" : "text-green-200"
            }`}
          >
            {isExhausted ? "Unavailable" : "Available"}
          </span>
        </div>

        <h3
          className={`text-4xl font-extrabold tracking-tight mb-1 ${
            isExhausted ? "text-gray-400" : "text-white"
          }`}
        >
          {balance}
        </h3>
        <p
          className={`text-sm font-medium ${
            isExhausted ? "text-gray-400" : "text-green-100/80"
          }`}
        >
          days remaining
        </p>
        <p
          className={`mt-4 text-lg font-bold ${
            isExhausted ? "text-gray-500" : "text-white"
          }`}
        >
          {label}
        </p>
      </div>

      <button
        onClick={onApply}
        disabled={isExhausted}
        className={`mt-6 w-full rounded-xl py-3 text-sm font-bold shadow-sm transition-all transform active:scale-95 ${
          isExhausted
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#fbbf24] text-green-900 hover:bg-[#f59e0b] hover:shadow-lg"
        }`}
      >
        {isExhausted ? "Limit Reached" : "Apply Now"}
      </button>
    </div>
  );
}
