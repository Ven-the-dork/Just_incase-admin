// src/features/leave/components/LeaveHistoryPanel.jsx
import { useState } from "react";
import { Calendar, Paperclip, ChevronDown, CheckCircle, XCircle, DollarSign, Ban } from "lucide-react";

function ActionDropdown({ onApprove, onReject, attachmentUrl }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronDown className="w-5 h-5 text-gray-600" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[180px]">
          <button
            onClick={() => {
              onApprove();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
          >
            <CheckCircle size={16} />
            Approve
          </button>
          <button
            onClick={() => {
              onReject();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <XCircle size={16} />
            Reject
          </button>
          {attachmentUrl && (
            <>
              <div className="border-t border-gray-200 my-1" />
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
              >
                <Paperclip size={16} />
                View Attachment
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function LeaveHistoryPanel({ applications, loading, onApprove, onReject }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <p className="text-center text-gray-500">Loading leave applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No Leave Applications</p>
          <p className="text-sm text-gray-400 mt-1">
            Leave applications will appear here once employees submit them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Calendar className="text-green-600" size={20} />
          Leave Applications
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage employee leave requests
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
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                {/* Employee */}
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-800">
                      {app.employees?.full_name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {app.employees?.department}
                    </p>
                  </div>
                </td>

                {/* Dates */}
                <td className="py-3 px-4 text-sm text-gray-600">
                  <div>
                    <p>{new Date(app.start_date).toLocaleDateString()}</p>
                    <p className="text-gray-400">to</p>
                    <p>{new Date(app.end_date).toLocaleDateString()}</p>
                  </div>
                </td>

                {/* ✅ UPDATED: Type & Reason with Paid/Unpaid Badge */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-800">
                      {app.leave_plans?.name}
                    </p>
                    {/* Paid/Unpaid Badge */}
                    {app.leave_plans?.is_paid ? (
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
                  <p className="text-sm text-gray-500">{app.reason}</p>
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      app.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : app.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : app.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {app.status.toUpperCase()}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-4">
                  {app.status === "pending" ? (
                    <ActionDropdown
                      onApprove={() => onApprove(app)}
                      onReject={() => onReject(app)}
                      attachmentUrl={app.attachment_url}
                    />
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
