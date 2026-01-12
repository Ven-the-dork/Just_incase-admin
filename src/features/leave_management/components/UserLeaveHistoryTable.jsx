// src/features/leave/components/UserLeaveHistoryTable.jsx
import { Clock, Paperclip } from "lucide-react";

export default function UserLeaveHistoryTable({ history, loading }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="text-green-600" size={20} />
        Application History
      </h2>

      <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Leave Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Date Range</th>
                <th className="px-6 py-4">File</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Loading history...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No leave applications yet.
                  </td>
                </tr>
              ) : (
                history.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {app.leave_plans?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="font-semibold">
                        {app.duration_days}
                      </span>{" "}
                      days
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      <div className="flex flex-col">
                        <span>
                          {new Date(app.start_date).toLocaleDateString()}
                        </span>
                        <span className="text-gray-400">to</span>
                        <span>
                          {new Date(app.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {app.attachment_url ? (
                        <a
                          href={app.attachment_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition text-xs font-medium"
                        >
                          <Paperclip size={14} /> View
                        </a>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                          app.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : app.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-gray-500 max-w-xs truncate"
                      title={app.reason}
                    >
                      {app.reason}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
