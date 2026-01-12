// src/features/employee/components/AddEmployeeDrawer.jsx
export default function AddEmployeeDrawer({
  open,
  newEmployee,
  onChangeField,
  onSubmit,
  error,
  onClose,
}) {
  return (
    <div
      className={`overflow-hidden transition-all duration-500 ease-in-out bg-yellow-50/50 ${
        open ? "max-h-[1200px] border-b border-yellow-100" : "max-h-0"
      }`}
    >
      {open && (
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold text-green-900 flex items-center gap-2">
            <span className="w-1 h-6 bg-yellow-400 rounded-full block" />
            New Employee Details
          </h3>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {["name", "department", "position", "email", "password"].map(
                (field) => (
                  <label key={field} className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {field}
                    </span>
                    <input
                      type={
                        field === "password"
                          ? "password"
                          : field === "email"
                          ? "email"
                          : "text"
                      }
                      name={field}
                      value={newEmployee[field]}
                      onChange={(e) => onChangeField(e)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  </label>
                )
              )}

              <label className="space-y-1.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Start Date
                </span>
                <input
                  type="date"
                  name="startDate"
                  value={newEmployee.startDate}
                  onChange={onChangeField}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:ring-2 focus:ring-green-500"
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Category
                </span>
                <select
                  name="category"
                  value={newEmployee.category}
                  onChange={onChangeField}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm bg-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select...</option>
                  <option value="Regular">Regular</option>
                  <option value="Job Order">Job Order</option>
                </select>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Gender
                </span>
                <select
                  name="gender"
                  value={newEmployee.gender}
                  onChange={onChangeField}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm bg-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 transition shadow-sm"
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-white text-gray-600 font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
            {error && (
              <p className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
