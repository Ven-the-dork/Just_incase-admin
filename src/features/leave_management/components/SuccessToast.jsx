// src/components/SuccessToast.jsx
import { CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export default function SuccessToast({ 
  isOpen, 
  message, 
  onClose,
  duration = 3000 // Auto-close after 3 seconds
}) {
  useEffect(() => {
    if (isOpen && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-white rounded-xl shadow-2xl border border-green-100 overflow-hidden min-w-[320px] max-w-md">
        {/* Green accent bar */}
        <div className="h-1 bg-gradient-to-r from-green-500 to-green-600" />
        
        <div className="p-4 flex items-start gap-3">
          {/* Success icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="text-green-600" size={20} />
          </div>
          
          {/* Message */}
          <div className="flex-1 pt-1">
            <h4 className="font-bold text-gray-900 text-sm mb-1">Success!</h4>
            <p className="text-gray-600 text-sm">{message}</p>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
