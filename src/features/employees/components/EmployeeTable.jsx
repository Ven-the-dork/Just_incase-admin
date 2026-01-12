// src/features/employee/components/EmployeeTable.jsx
import { useState, useRef, useEffect } from "react";
import { Search, Filter, Settings } from "lucide-react";

function ActionDropdown({ onViewProfile, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 rounded-lg cursor-pointer bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all"
      >
        Actions
        <Settings size={14} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5">
          <button
            onClick={() => {
              setOpen(false);
              onViewProfile();
            }}
            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors cursor-pointer"
          >
            View Profile
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function EmployeeTable({
  employees,
  loading,
  searchTerm,
  onChangeSearch,
  sortDirection,
  onToggleSortDirection,
  onToggleAddForm,
  showAddForm,
  onViewProfile,
  onDeleteEmployee,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Toolbar */}
      <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search employees by name, dept..."
            value={searchTerm}
            onChange={(e) => onChangeSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
            <button
              onClick={onToggleSortDirection}
              className="p-2 hover:bg-white hover:shadow-sm rounded-md cursor-pointer transition-all text-gray-600"
              title={`Sort: ${sortDirection === "asc" ? "A → Z" : "Z → A"}`}
            >
              <Filter size={18} />
            </button>
          </div>
          <button
            onClick={onToggleAddForm}
            className="flex items-center gap-2 bg-green-700 cursor-pointer hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-green-100"
          >
            <span>{showAddForm ? "Close Form" : "Add Employee"}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="p-5">Employee</th>
              <th className="p-5">Role & Dept</th>
              <th className="p-5">Category</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-gray-50/80 transition-colors group"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-sm">
                        {emp.profile_image_url ? (
                          <img
                            src={emp.profile_image_url}
                            className="w-full h-full rounded-full object-cover"
                            alt={emp.name}
                          />
                        ) : (
                          emp.name?.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-sm">
                          {emp.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="text-sm font-medium text-gray-700">
                      {emp.position}
                    </div>
                    <div className="text-xs text-gray-400">
                      {emp.department}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                      {emp.category}
                    </span>
                  </td>
                  <td className="p-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        emp.status === "Active"
                          ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                          : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          emp.status === "Active"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      />
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <ActionDropdown
                      onViewProfile={() => onViewProfile(emp)}
                      onDelete={() => onDeleteEmployee(emp)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
