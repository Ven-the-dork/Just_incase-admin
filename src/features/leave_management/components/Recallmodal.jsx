// src/features/leave/components/RecallModal.jsx
export default function RecallModal({
  open,
  leave,
  submitting,
  newDate,
  reason,
  onChangeDate,
  onChangeReason,
  onSubmit,
  onClose,
}) {
  if (!open || !leave) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Confirm Recall
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Request{" "}
          <span className="font-bold text-gray-800">
            {leave.employees?.full_name}
          </span>{" "}
          to return early.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="font-bold text-gray-500 text-xs uppercase">
              New Resumption Date
            </span>
            <input
              type="date"
              value={newDate}
              onChange={(e) => onChangeDate(e.target.value)}
              className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </label>
          <label className="block text-sm">
            <span className="font-bold text-gray-500 text-xs uppercase">
              Reason for Recall
            </span>
            <textarea
              rows="2"
              value={reason}
              onChange={(e) => onChangeReason(e.target.value)}
              className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="e.g. Emergency project meeting..."
            />
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700 transition shadow-lg shadow-orange-100"
            >
              {submitting ? "Processing..." : "Confirm Recall"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-600 font-bold py-2.5 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
