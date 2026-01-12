// src/features/leave/components/LeaveRecallPanel.jsx
import { Calendar, AlertCircle, DollarSign, Ban } from "lucide-react";

export default function LeaveRecallPanel({ ongoingLeaves, loading, onRecall }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <p className="text-center text-gray-500">Loading ongoing leaves...</p>
      </div>
    );
  }

  if (ongoingLeaves.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No Ongoing Recallable Leaves</p>
          <p className="text-sm text-gray-400 mt-1">
            Ongoing leaves that can be recalled will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <AlertCircle className="text-orange-600" size={20} />
          Ongoing Recallable Leaves
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Recall employees who are currently on approved leave
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Employee
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Dates
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Type & Reason
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {ongoingLeaves.map((leave) => (
              <tr key={leave.id} className="border-b border-gray-100 hover:bg-gray-50">
                {/* Employee */}
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-800">
                      {leave.employees?.full_name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {leave.employees?.department}
                    </p>
                  </div>
                </td>

                {/* Dates */}
                <td className="py-3 px-4 text-sm text-gray-600">
                  <div>
                    <p>{new Date(leave.start_date).toLocaleDateString()}</p>
                    <p className="text-gray-400">to</p>
                    <p>{new Date(leave.end_date).toLocaleDateString()}</p>
                  </div>
                </td>

                {/* ✅ UPDATED: Type & Reason with Paid/Unpaid Badge */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-800">
                      {leave.leave_plans?.name}
                    </p>
                    {/* Paid/Unpaid Badge */}
                    {leave.leave_plans?.is_paid ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        <DollarSign size={10} />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        <Ban size={10} />
                        Unpaid
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{leave.reason}</p>
                </td>
                {/* Actions */}
                <td className="py-3 px-4">
                  <button
                    onClick={() => {
                      console.log("🔘 Recall button clicked for leave:", leave);
                      console.log("🔘 onRecall function:", onRecall);
                      onRecall(leave);
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                  >
                    Recall Leave
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
