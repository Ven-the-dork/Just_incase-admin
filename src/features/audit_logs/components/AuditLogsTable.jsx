// src/features/audit_logs/components/AuditLogsTable.jsx
import { FileText, Clock, User, Activity } from "lucide-react";

const ACTION_BADGES = {
  admin_login: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-600/20",
  },
  admin_logout: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    ring: "ring-gray-600/20",
  },
  created_employee: {
    bg: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-600/20",
  },
  deleted_employee: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-600/20",
  },
  updated_employee: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    ring: "ring-yellow-600/20",
  },
  approved_leave: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-600/20",
  },
  rejected_leave: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    ring: "ring-orange-600/20",
  },
  recalled_leave: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-600/20",
  },
};

function getBadge(action) {
  return (
    ACTION_BADGES[action] || {
      bg: "bg-gray-50",
      text: "text-gray-700",
      ring: "ring-gray-600/20",
    }
  );
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AuditLogsTable({ auditLogs, loading, error }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <FileText size={18} className="text-gray-400" /> Activity History
        </h3>
        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
          {auditLogs.length} entries
        </span>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-4 w-48">
                <div className="flex items-center gap-1">
                  <Clock size={14} /> Timestamp
                </div>
              </th>
              <th className="p-4 w-48">
                <div className="flex items-center gap-1">
                  <Activity size={14} /> Action
                </div>
              </th>
              <th className="p-4 w-48">
                <div className="flex items-center gap-1">
                  <User size={14} /> User
                </div>
              </th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="4" className="p-12 text-center text-gray-400 animate-pulse">
                  Fetching audit logs...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="p-12 text-center text-red-500 font-medium">
                  {error}
                </td>
              </tr>
            ) : auditLogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-12 text-center text-gray-400">
                  No matching logs found.
                </td>
              </tr>
            ) : (
              auditLogs.map((log) => {
                const badge = getBadge(log.action);
                return (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="p-4 whitespace-nowrap text-gray-500 font-mono text-xs">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ring-1 ring-inset ${badge.bg} ${badge.text} ${badge.ring}`}
                      >
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-700 text-sm flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">
                          {log.user_name ? log.user_name.charAt(0) : "S"}
                        </div>
                        {log.user_name || "System"}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm leading-relaxed max-w-lg truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:bg-white group-hover:shadow-lg group-hover:rounded-lg group-hover:z-20 relative transition-all">
                      {log.details}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
