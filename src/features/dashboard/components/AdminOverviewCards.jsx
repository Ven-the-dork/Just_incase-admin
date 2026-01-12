// src/features/dashboard/components/AdminOverviewCards.jsx
import { Users, Calendar, TrendingUp } from "lucide-react";

export default function AdminOverviewCards({
  employeeCount,
  pendingLeavesCount,
  loadingCounts,
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-bold text-gray-800">Overview</h2>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700 uppercase tracking-wider">
          Live
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-100 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users size={24} className="text-white" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                <TrendingUp size={12} /> +8%
              </span>
            </div>
            <div className="text-4xl font-extrabold mb-1">
              {loadingCounts ? "..." : employeeCount}
            </div>
            <p className="text-green-100 text-sm font-medium opacity-90">
              Total Employees
            </p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
        </div>

        <div className="bg-orange-400 rounded-2xl p-6 text-white shadow-lg shadow-orange-100 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Calendar size={24} className="text-white" />
              </div>
              {pendingLeavesCount > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold bg-white text-orange-600 px-2 py-1 rounded-full animate-pulse">
                  Action Needed
                </span>
              )}
            </div>
            <div className="text-4xl font-extrabold mb-1">
              {loadingCounts ? "..." : pendingLeavesCount}
            </div>
            <p className="text-orange-50 text-sm font-medium opacity-90">
              Pending Leaves
            </p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
        </div>
      </div>
    </section>
  );
}
