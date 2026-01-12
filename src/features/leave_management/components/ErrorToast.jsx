// src/components/ErrorToast.jsx
import { XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export default function ErrorToast({ isOpen, message, onClose, duration = 3000 }) {
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
    <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in">
      <XCircle className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 hover:bg-red-600 rounded p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
