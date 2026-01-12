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

export default function RecallModal({ leave, onClose, onConfirm, isSubmitting }) {
  const [resumptionDate, setResumptionDate] = useState("");
  const [reason, setReason] = useState("");
  const [calculation, setCalculation] = useState(null);

  // Calculate days when resumption date changes
  useEffect(() => {
    if (!resumptionDate || !leave) {
      setCalculation(null);
      return;
    }

    const startDate = leave.start_date;
    const endDate = leave.end_date;

    // Calculate last day of leave (day before resumption)
    const resumeDate = new Date(resumptionDate);
    const lastLeaveDate = new Date(resumeDate);
    lastLeaveDate.setDate(lastLeaveDate.getDate() - 1);
    const lastLeaveDateStr = lastLeaveDate.toISOString().split('T')[0];

    // Days used (start to day before resumption)
    const daysUsed = calculateWorkingDays(startDate, lastLeaveDateStr);
    
    // Days to refund (resumption date to original end date)
    const daysToRefund = calculateWorkingDays(resumptionDate, endDate);

    setCalculation({
      daysUsed,
      daysToRefund,
      originalTotal: leave.duration_days,
    });
  }, [resumptionDate, leave]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(resumptionDate, reason);
  };

  const canSubmit = resumptionDate && reason.trim() && !isSubmitting;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="text-orange-600" size={24} />
              Recall Leave
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Employee will be notified and unused days will be refunded
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Leave Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Current Leave Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-blue-700">Employee:</span>
                <span className="font-medium text-blue-900 ml-2">
                  {leave?.employees?.full_name}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Leave Type:</span>
                <span className="font-medium text-blue-900 ml-2">
                  {leave?.leave_plans?.name}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Leave Period:</span>
                <span className="font-medium text-blue-900 ml-2">
                  {new Date(leave?.start_date).toLocaleDateString()} - {new Date(leave?.end_date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Total Days:</span>
                <span className="font-medium text-blue-900 ml-2">
                  {leave?.duration_days} working days
                </span>
              </div>
            </div>
          </div>

          {/* New Resumption Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Resumption Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={resumptionDate}
              onChange={(e) => setResumptionDate(e.target.value)}
              min={leave?.start_date}
              max={leave?.end_date}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Select the date the employee should return to work
            </p>
          </div>

          {/* Calculation Display */}
          {calculation && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-5">
              <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} />
                Calculation Summary
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Days Used */}
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Days Used</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {calculation.daysUsed}
                  </p>
                </div>

                {/* Days Refunded */}
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Days Refunded</p>
                  <p className="text-3xl font-bold text-green-600">
                    +{calculation.daysToRefund}
                  </p>
                </div>

                {/* Original Total */}
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <p className="text-xs text-gray-600 mb-1">Original Total</p>
                  <p className="text-3xl font-bold text-gray-700">
                    {calculation.originalTotal}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <p className="text-gray-700">
                  • Employee used <span className="font-semibold text-orange-600">{calculation.daysUsed} days</span> of leave
                </p>
                <p className="text-gray-700">
                  • <span className="font-semibold text-green-600">{calculation.daysToRefund} days</span> will be refunded to their balance
                </p>
                <p className="text-gray-700">
                  • If employee doesn't return on <span className="font-semibold">{new Date(resumptionDate).toLocaleDateString()}</span>, they'll be marked <span className="font-semibold text-red-600">absent</span>
                </p>
              </div>
            </div>
          )}

          {/* Recall Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Recall <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              placeholder="Explain why the employee is being recalled (e.g., urgent project requirement, operational needs)..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {isSubmitting ? "Processing..." : "Confirm Recall"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
