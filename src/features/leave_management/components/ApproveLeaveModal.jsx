// src/components/ApproveLeaveModal.jsx
import { X, CheckCircle } from 'lucide-react';

export default function ApproveLeaveModal({ 
  isOpen, 
  employeeName,
  leaveType,
  onConfirm, 
  onCancel,
  isApproving = false 
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
        {/* Header - Green theme */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <CheckCircle className="text-white" size={18} />
            </div>
            <h3 className="text-lg font-bold text-white">Approve Leave</h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isApproving}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 text-sm">
            Approve <span className="font-bold text-gray-900">{leaveType}</span> request from{' '}
            <span className="font-bold text-gray-900">{employeeName}</span>?
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isApproving}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isApproving}
            className="px-4 py-2 rounded-lg bg-green-700 text-white text-sm font-bold hover:bg-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isApproving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Approving...
              </>
            ) : (
              'Approve'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
