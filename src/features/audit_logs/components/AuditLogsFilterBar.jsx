// src/features/audit_logs/components/AuditLogsFilterBar.jsx
import { Search, Filter, ArrowUpDown, Download } from "lucide-react";

export default function AuditLogsFilterBar({
  searchTerm,
  setSearchTerm,
  filterAction,
  setFilterAction,
  sortDirection,
  toggleSortDirection,
  onExport,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5 relative">
          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1.5">
            <Search size={12} /> Search Logs
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search user, action, details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1.5">
            <Filter size={12} /> Filter Action
          </label>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full py-2.5 px-3 bg-gray-50 border cursor-pointer border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
          >
            <option value="all">All Actions</option>
            <option value="created_employee">Created Employee</option>
            <option value="deleted_employee">Deleted Employee</option>
          </select>
        </div>

        <div className="md:col-span-4 flex gap-2">
          <button
            onClick={toggleSortDirection}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-bold transition shadow-sm"
          >
            <ArrowUpDown size={16} />
            {sortDirection === "asc" ? "Oldest" : "Newest"}
          </button>
          <button
            onClick={onExport}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-bold transition shadow-green-200 shadow-md"
          >
            <Download size={16} /> CSV
          </button>
        </div>
      </div>
    </div>
  );
}

