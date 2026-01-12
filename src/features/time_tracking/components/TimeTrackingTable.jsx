// src/pages/admin/timetracking/components/TimeTrackingTable.jsx
import { DollarSign, Ban, Palmtree } from "lucide-react";

export default function TimeTrackingTable({ loading, rows }) {
  const getStatusBadge = (status) => {
    const styles = {
      Present: "bg-green-100 text-green-700 border-green-200",
      Late: "bg-yellow-100 text-yellow-700 border-yellow-200",
      "On Paid Leave": "bg-blue-100 text-blue-700 border-blue-200",
      "On Unpaid Leave": "bg-orange-100 text-orange-700 border-orange-200",
      Weekend: "bg-teal-100 text-teal-700 border-teal-200", // ✅ NEW
      Absent: "bg-red-100 text-red-700 border-red-200",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
          styles[status] || "bg-gray-100 text-gray-700 border-gray-200"
        }`}
      >
        {status === "On Paid Leave" && <DollarSign size={12} />}
        {status === "On Unpaid Leave" && <Ban size={12} />}
        {status === "Weekend" && <Palmtree size={12} />}
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                EMPLOYEE
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                DEPARTMENT
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                DATE
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                CLOCK IN
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">
                      Loading attendance...
                    </p>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12">
                  <p className="text-gray-500 font-medium">No records found.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your filters
                  </p>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-800">
                    {row.employee}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {row.department}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {row.date}
                  </td>
                  <td className="py-4 px-6 text-sm font-mono text-gray-700">
                    {row.clockIn}
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(row.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
