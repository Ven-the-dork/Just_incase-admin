// src/features/employee/components/PasswordConfirmModal.jsx
export default function PasswordConfirmModal({
  open,
  employee,
  password,
  error,
  verifying,
  onChangePassword,
  onConfirm,
  onClose,
}) {
  if (!open || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Confirm Deletion
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to remove{" "}
          <span className="font-bold text-gray-900">{employee.name}</span>? This
          action is permanent.
        </p>

        <form onSubmit={onConfirm} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
          />
          {error && (
            <p className="text-xs text-red-600 font-bold">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={verifying}
              className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition disabled:opacity-50"
            >
              {verifying ? "Verifying..." : "Delete"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
