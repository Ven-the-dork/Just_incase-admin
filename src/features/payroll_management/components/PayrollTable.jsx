// src/pages/admin/payroll/components/PayrollTable.jsx
import { Search, CheckSquare, Square } from "lucide-react";

export default function PayrollTable({
  searchTerm,
  onChangeSearch,
  loadingEmployees,
  rowsWithPreview,
  selectedEmployeeIds,
  onToggleRow,
  onToggleAll,
  allVisibleSelected,
  rateErrorById,
  onRateChange,
  onSaveRate,
  peso,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Search Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name, department, or position..."
            value={searchTerm}
            onChange={(e) => onChangeSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase">
                <button
                  onClick={onToggleAll}
                  className="flex items-center gap-2 hover:text-green-600 transition-colors"
                >
                  {allVisibleSelected ? (
                    <CheckSquare size={18} className="text-green-600" />
                  ) : (
                    <Square size={18} />
                  )}
                  Employee
                </button>
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase">
                Department
              </th>
              <th className="text-center py-4 px-6 text-xs font-semibold text-gray-700 uppercase">
                Worked Days
              </th>
              <th className="text-center py-4 px-6 text-xs font-semibold text-gray-700 uppercase">
                Paid Leave
              </th>
              <th className="text-center py-4 px-6 text-xs font-semibold text-gray-700 uppercase">
                Payable Days
              </th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-gray-700 uppercase">
                Daily Rate
              </th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-gray-700 uppercase">
                Gross Pay
              </th>
            </tr>
          </thead>
          <tbody>
            {loadingEmployees ? (
              <tr>
                <td colSpan="7" className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">
                      Loading employees...
                    </p>
                  </div>
                </td>
              </tr>
            ) : rowsWithPreview.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12">
                  <p className="text-gray-500 font-medium">
                    No employees match your search.
                  </p>
                </td>
              </tr>
            ) : (
              rowsWithPreview.map((row) => {
                const isSelected = selectedEmployeeIds.includes(row.id);
                const errMsg = rateErrorById[row.id] || "";

                return (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-100 transition-colors ${
                      isSelected ? "bg-green-50" : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Employee Name with Checkbox & Profile Picture */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onToggleRow(row.id)}
                          className="flex-shrink-0"
                        >
                          {isSelected ? (
                            <CheckSquare
                              size={18}
                              className="text-green-600"
                            />
                          ) : (
                            <Square size={18} className="text-gray-400" />
                          )}
                        </button>
                        <div className="flex items-center gap-3">
                          {/* ✅ Profile Picture from database */}
                          {row.profile_image_url ? (
                            <img
                              src={row.profile_image_url}
                              alt={row.full_name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                e.target.style.display = 'none';
                                const fallback = e.target.nextElementSibling;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          {/* Fallback: Initials */}
                          <div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-sm border-2 border-gray-200"
                            style={{
                              display: row.profile_image_url ? 'none' : 'flex'
                            }}
                          >
                            {row.full_name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {row.full_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {row.position}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {row.department}
                      </span>
                    </td>

                    {/* Worked Days (Present + Late) */}
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                        {row.workedDays || 0}
                      </span>
                    </td>

                    {/* Paid Leave Days */}
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                        {row.paidLeaveDays || 0}
                      </span>
                    </td>

                    {/* Payable Days (Worked + Paid Leave) */}
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-purple-100 text-purple-700">
                        {row.payableDays || 0}
                      </span>
                    </td>

                    {/* Daily Rate (Editable) */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-end gap-1">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                            ₱
                          </span>
                          <input
                            type="number"
                            value={row.daily_rate || ""}
                            onChange={(e) => onRateChange(row.id, e.target.value)}
                            onBlur={() => onSaveRate(row.id)}
                            className={`w-32 pl-7 pr-3 py-2 rounded-lg border text-sm font-medium text-right focus:ring-2 outline-none transition-colors ${
                              errMsg
                                ? "border-red-300 focus:ring-red-200 bg-red-50"
                                : "border-gray-200 focus:ring-green-500 hover:border-gray-300"
                            }`}
                          />
                        </div>
                        {errMsg && (
                          <span className="text-xs text-red-600 font-medium">
                            {errMsg}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Gross Pay */}
                    <td className="py-4 px-6 text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {peso(Number(row.grossPay) || 0)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {rowsWithPreview.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Showing <span className="font-semibold">{rowsWithPreview.length}</span> employees
            </span>
            <span className="text-gray-600">
              Selected: <span className="font-semibold text-green-600">{selectedEmployeeIds.length}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
