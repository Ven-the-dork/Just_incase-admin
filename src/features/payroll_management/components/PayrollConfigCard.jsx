// src/pages/admin/payroll/components/PayrollConfigCard.jsx
import { Calendar } from "lucide-react";

export default function PayrollConfigCard({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
  loadingAttendance,
  processMsg,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
              <Calendar size={12} /> Cutoff Start
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onChangeStart(e.target.value)}
              className="w-full p-2.5 bg-gray-50  cursor-pointer border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
              <Calendar size={12} /> Cutoff End
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onChangeEnd(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 cursor-pointer rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </label>
        </div>
      </div>

      {loadingAttendance && (
        <p className="mt-2 text-xs text-orange-500 font-medium animate-pulse">
          Syncing attendance data...
        </p>
      )}

      {processMsg && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm font-medium ${
            processMsg.includes("Success")
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-red-50 text-red-700 border border-red-100"
          }`}
        >
          {processMsg}
        </div>
      )}
    </div>
  );
}
