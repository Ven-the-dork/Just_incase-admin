// src/features/leave/components/LeaveSettingsPanel.jsx
import { Briefcase, Settings, DollarSign, Ban } from "lucide-react";

export default function LeaveSettingsPanel({
  // data
  leavePlans,

  // create form state
  leavePlanName,
  durationDays,
  allowRecall,
  isPaid, // ✅ NEW

  // edit form state
  editingPlan,
  editName,
  editDuration,
  editAllowRecall,
  editIsPaid, // ✅ NEW
  openDropdown,

  // handlers
  onChangeLeavePlanName,
  onChangeDurationDays,
  onChangeAllowRecall,
  onChangeIsPaid, // ✅ NEW
  onCreate,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onChangeEditName,
  onChangeEditDuration,
  onChangeEditAllowRecall,
  onChangeEditIsPaid, // ✅ NEW
  onDeletePlan,
  setOpenDropdown,
}) {
  return (
    <div className="space-y-6">
      {/* CREATE FORM */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="text-green-600" size={20} />
          Create New Leave Plan
        </h3>

        <form onSubmit={onCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Leave Plan Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Plan Name
              </label>
              <input
                type="text"
                value={leavePlanName}
                onChange={(e) => onChangeLeavePlanName(e.target.value)}
                placeholder="e.g., Sick Leave"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Duration Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Days)
              </label>
              <input
                type="number"
                value={durationDays}
                onChange={(e) => onChangeDurationDays(e.target.value)}
                placeholder="e.g., 15"
                min="1"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Allow Recall & Paid Leave - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Allow Recall Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allow Recall
              </label>
              <select
                value={allowRecall}
                onChange={(e) => onChangeAllowRecall(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* ✅ NEW: Paid Leave Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid Leave
              </label>
              <select
                value={isPaid}
                onChange={(e) => onChangeIsPaid(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="Yes">Yes (Paid)</option>
                <option value="No">No (Unpaid)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
          >
            Create Leave Plan
          </button>
        </form>
      </div>

      {/* LEAVE PLANS TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Briefcase className="text-green-600" size={20} />
          Existing Leave Plans
        </h3>

        {leavePlans.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No leave plans created yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Plan Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Duration
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Recallable
                  </th>
                  {/* ✅ NEW: Paid Column */}
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {leavePlans.map((plan) => (
                  <tr key={plan.id} className="border-b border-gray-100 hover:bg-gray-50">
                    {/* Editing Row */}
                    {editingPlan?.id === plan.id ? (
                      <>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => onChangeEditName(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={editDuration}
                            onChange={(e) => onChangeEditDuration(e.target.value)}
                            min="1"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={editAllowRecall}
                            onChange={(e) => onChangeEditAllowRecall(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                          >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </td>
                        {/* ✅ NEW: Edit Paid Dropdown */}
                        <td className="py-3 px-4">
                          <select
                            value={editIsPaid}
                            onChange={(e) => onChangeEditIsPaid(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                          >
                            <option value="Yes">Paid</option>
                            <option value="No">Unpaid</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={onSaveEdit}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={onCancelEdit}
                              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* Normal Row */}
                        <td className="py-3 px-4 text-gray-800 font-medium">
                          {plan.name}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {plan.duration_days} days
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {plan.allow_recall ? "Yes" : "No"}
                        </td>
                        {/* ✅ NEW: Display Paid/Unpaid Badge */}
                        <td className="py-3 px-4">
                          {plan.is_paid ? (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                              <DollarSign size={12} />
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                              <Ban size={12} />
                              Unpaid
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 relative">
                          <button
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === plan.id ? null : plan.id
                              )
                            }
                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                          >
                            ⋮
                          </button>

                          {openDropdown === plan.id && (
                            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-32">
                              <button
                                onClick={() => onStartEdit(plan)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => onDeletePlan(plan)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
