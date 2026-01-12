// src/features/dashboard/components/AdminQuickActions.jsx
import { CreditCard, Clock, ChevronRight } from "lucide-react";

export default function AdminQuickActions({ pendingLeavesCount, navigate }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => navigate("/PayrollManagement")}
          className="flex items-center gap-4 p-5 bg-white rounded-xl border cursor-pointer border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all text-left group"
        >
          <div className="p-3 rounded-full bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <CreditCard size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">
              Process Payroll
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Open payroll system</p>
          </div>
          <div className="ml-auto text-gray-300 group-hover:text-green-600 transition-colors">
            <ChevronRight size={20} />
          </div>
        </button>

        <button
          onClick={() => navigate("/leave-management")}
          className="flex items-center gap-4 p-5 bg-white rounded-xl border cursor-pointer border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all text-left group"
        >
          <div className="p-3 rounded-full bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
              Leave Requests
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {pendingLeavesCount} pending
            </p>
          </div>
          <div className="ml-auto text-gray-300 group-hover:text-orange-500 transition-colors">
            <ChevronRight size={20} />
          </div>
        </button>
      </div>
    </section>
  );
}
