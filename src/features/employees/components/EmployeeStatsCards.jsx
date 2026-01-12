// src/features/employee/components/EmployeeStatsCards.jsx
import { Users, Briefcase, UserX } from "lucide-react";

export default function EmployeeStatsCards({ employees }) {
  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.status === "Active").length;
  const inactiveCount = employees.filter((e) => e.status === "Inactive").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Employees */}
      <div className="bg-yellow-500 rounded-2xl p-6 text-white shadow-lg shadow-green-100 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                <Users size={22} />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-1 tracking-tight">
              {totalCount}
            </div>
            <p className="text-sm font-bold opacity-90 uppercase tracking-wide">
              Total Employees
            </p>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
      </div>

      {/* Active - Green Theme */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-200 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                <Briefcase size={22} />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-1 tracking-tight">
              {activeCount}
            </div>
            <p className="text-sm font-bold opacity-90 uppercase tracking-wide">
              Active Now
            </p>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
      </div>

      {/* Inactive - Red Theme */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg shadow-red-200 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                <UserX size={22} />
              </div>
            </div>
            <div className="text-3xl font-extrabold mb-1 tracking-tight">
              {inactiveCount}
            </div>
            <p className="text-sm font-bold opacity-90 uppercase tracking-wide">
              Inactive / Offline
            </p>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
      </div>
    </div>
  );
}
