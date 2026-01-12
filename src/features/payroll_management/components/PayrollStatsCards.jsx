// src/pages/admin/payroll/components/PayrollStatsCards.jsx
import { Users, DollarSign } from "lucide-react";

export default function PayrollStatsCards({ selectedCount, totalGross, peso }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Selected employees */}
      <div className="bg-green-600 rounded-xl p-5 text-white shadow-lg shadow-green-100 flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-green-100 text-xs font-bold uppercase mb-1">
            Selected Employees
          </p>
          <p className="text-3xl font-extrabold">{selectedCount}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm relative z-10">
          <Users size={24} className="text-white" />
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      </div>

      {/* Total gross */}
      <div className="bg-yellow-400 rounded-xl p-5 text-green-900 shadow-lg shadow-yellow-100 flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-green-800/70 text-xs font-bold uppercase mb-1">
            Total Gross Pay
          </p>
          <p className="text-3xl font-extrabold">{peso(totalGross)}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm relative z-10">
          <DollarSign size={24} className="text-green-900" />
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      </div>
    </div>
  );
}
