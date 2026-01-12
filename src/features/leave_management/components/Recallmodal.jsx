// src/features/leave/components/RecallModal.jsx
import { useState, useEffect } from "react";
import { X, Calendar, AlertCircle } from "lucide-react";

// Calculate working days (exclude Sundays only)
function calculateWorkingDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end < start) return 0;

  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0) count++; // Exclude Sunday only
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

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
  const [calculation, setCalculation] = useState(null);

  // ✅ Calculate days when resumption date changes
  useEffect(() => {
    if (!newDate || !leave) {
      setCalculation(null);
      return;
    }

    const startDate = leave.start_date;
    const endDate = leave.end_date;

    // Calculate last day of leave (day before resumption)
    const resumeDate = new Date(newDate);
    const lastLeaveDate = new Date(resumeDate);
    lastLeaveDate.setDate(lastLeaveDate.getDate() - 1);
    const lastLeaveDateStr = lastLeaveDate.toISOString().split('T')[0];

    // Days used (start to day before resumption)
    const daysUsed = calculateWorkingDays(startDate, lastLeaveDateStr);
    
    // Days to refund (resumption date to original end date)
    const daysToRefund = calculateWorkingDays(newDate, endDate);

    console.log("📊 Recall Calculation:", {
      originalPeriod: `${startDate} to ${endDate}`,
      newResumptionDate: newDate,
      daysUsed,
      daysToRefund
    });

    setCalculation({
      daysUsed,
      daysToRefund,
      originalTotal: leave.duration_days,
    });
  }, [newDate, leave]);

  // ✅ FIXED: Proper form submit handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && typeof onSubmit === 'function') {
      onSubmit(e);
    }
  };

  if (!open || !leave) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Calendar className="text-orange-600" size={20} />
              Confirm Recall
            </h2>
            <p className="text-sm text-gray-500">
              Request{" "}
              <span className="font-bold text-gray-800">
                {leave.employees?.full_name}
              </span>{" "}
              to return early.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={submitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Leave Details */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-blue-700">Leave Type:</span>
              <span className="font-medium text-blue-900 ml-2">
                {leave.leave_plans?.name}
              </span>
            </div>
            <div>
              <span className="text-blue-700">Original Period:</span>
              <span className="font-medium text-blue-900 ml-2">
                {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* New Resumption Date */}
          <label className="block text-sm">
            <span className="font-bold text-gray-500 text-xs uppercase">
              New Resumption Date
            </span>
            <input
              type="date"
              value={newDate}
              onChange={(e) => onChangeDate(e.target.value)}
              min={leave.start_date}
              max={leave.end_date}
              required
              className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </label>

          {/* ✅ Calculation Display */}
          {calculation && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-green-700" />
                <h3 className="font-semibold text-green-900 text-sm">Calculation</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-3">
                {/* Days Used */}
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Days Used</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {calculation.daysUsed}
                  </p>
                </div>

                {/* Days Refunded */}
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Days Refunded</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{calculation.daysToRefund}
                  </p>
                </div>

                {/* Original Total */}
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Original Total</p>
                  <p className="text-2xl font-bold text-gray-700">
                    {calculation.originalTotal}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-700">
                <p>
                  • Employee used <span className="font-semibold text-orange-600">{calculation.daysUsed} days</span> of leave
                </p>
                <p>
                  • <span className="font-semibold text-green-600">{calculation.daysToRefund} days</span> will be refunded to their balance
                </p>
                <p>
                  • If employee doesn't return on <span className="font-semibold">{new Date(newDate).toLocaleDateString()}</span>, they'll be marked <span className="font-semibold text-red-600">absent</span>
                </p>
              </div>
            </div>
          )}

          {/* Reason */}
          <label className="block text-sm">
            <span className="font-bold text-gray-500 text-xs uppercase">
              Reason for Recall
            </span>
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => onChangeReason(e.target.value)}
              required
              className="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              placeholder="e.g. Emergency project meeting..."
            />
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || !newDate || !reason.trim()}
              className="flex-1 bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-orange-100"
            >
              {submitting ? "Processing..." : "Confirm Recall"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 bg-gray-100 text-gray-600 font-bold py-2.5 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
