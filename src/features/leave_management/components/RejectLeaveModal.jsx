// src/components/RejectLeaveModal.jsx
import { X, XCircle } from 'lucide-react';

export default function RejectLeaveModal({ 
  isOpen, 
  employeeName,
  leaveType,
  onConfirm, 
  onCancel,
  isRejecting = false 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header - Green theme with red accent */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <XCircle className="text-white" size={18} />
            </div>
            <h3 className="text-lg font-bold text-white">Reject Leave</h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isRejecting}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 text-sm">
            Reject <span className="font-bold text-gray-900">{leaveType}</span> request from{' '}
            <span className="font-bold text-gray-900">{employeeName}</span>?
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isRejecting}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isRejecting}
            className="px-4 py-2 rounded-lg bg-green-700 text-sm font-bold hover:bg-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isRejecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-white">Rejecting...</span>
              </>
            ) : (
              <span className="text-red-500">Reject</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
