// src/features/leave/components/LeaveApplicationModal.jsx
import { X, Paperclip, FileText } from "lucide-react";

// copy of your helper for the modal summary
function calculateDuration(start, end) {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);
  if (endDate < startDate) return 0;

  let count = 0;
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const day = currentDate.getDay();
    if (day !== 0 && day !== 6) count++;
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return count;
}

export default function LeaveApplicationModal({
  onClose,
  leaveType,
  remainingBalance,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  reason,
  setReason,
  attachment,
  setAttachment,
  onSubmit,
  submitting,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Application</h2>
            <p className="text-sm text-gray-500 mt-1">
              Applying for{" "}
              <span className="text-green-700 font-bold">
                {leaveType?.label}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="bg-green-50 rounded-xl px-4 py-3 flex justify-between items-center border border-green-100">
            <span className="text-sm font-medium text-green-800">
              Current Balance
            </span>
            <span className="text-lg font-bold text-green-700">
              {remainingBalance} Days
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
              />
            </div>
          </div>

          <div className="flex justify-between items-center px-2">
            <span className="text-xs text-gray-400 font-medium">
              Weekends are automatically excluded
            </span>
            <span className="text-sm font-bold text-gray-700">
              Total:{" "}
              <span className="text-green-600">
                {calculateDuration(startDate, endDate)} days
              </span>
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Supporting Document{" "}
              <span className="normal-case font-normal text-gray-400">
                (Optional)
              </span>
            </label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 hover:border-green-400 transition group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {attachment ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <FileText size={20} />
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {attachment.name}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-green-600 transition-colors">
                    <Paperclip size={20} />
                    <p className="text-xs font-medium">Click to upload file</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) =>
                  e.target.files && setAttachment(e.target.files[0])
                }
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Reason for Leave
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="Please describe why you are requesting leave..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-green-700 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-700/30 hover:bg-green-800 hover:shadow-xl transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
