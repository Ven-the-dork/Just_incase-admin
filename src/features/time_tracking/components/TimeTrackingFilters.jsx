// src/pages/admin/timetracking/components/TimeTrackingFilters.jsx
import { Calendar, Building2, Filter, Search } from "lucide-react";

export default function TimeTrackingFilters({
  selectedDate,
  onChangeDate,
  selectedDepartment,
  onChangeDepartment,
  selectedStatus,
  onChangeStatus,
  searchTerm,
  onChangeSearch,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Picker */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="text-gray-400" />
            DATE
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onChangeDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Department Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Building2 size={16} className="text-gray-400" />
            DEPARTMENT
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => onChangeDepartment(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          >
            <option value="All">All Departments</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        {/* ✅ UPDATED: Status Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Filter size={16} className="text-gray-400" />
            STATUS
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onChangeStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          >
            <option value="All">All Status</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="On Paid Leave">On Paid Leave</option>
            <option value="On Unpaid Leave">On Unpaid Leave</option>
            <option value="Weekend">Weekend</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Search size={16} className="text-gray-400" />
            SEARCH
          </label>
          <input
            type="text"
            placeholder="Search name..."
            value={searchTerm}
            onChange={(e) => onChangeSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </div>
  );
}
