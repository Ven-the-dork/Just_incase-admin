// src/features/employee/components/EmployeeProfileModal.jsx
import { ChevronDown, Mail, CalendarDays } from "lucide-react";

export default function EmployeeProfileModal({ employee, open, onClose }) {
  if (!open || !employee) return null;

  const {
    name,
    email,
    department,
    position,
    profile_image_url,
    status,
    category,
    gender,
    startDate,
  } = employee;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-32 bg-gradient-to-r from-green-600 to-green-400 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
          >
            <ChevronDown size={20} />
          </button>
        </div>
        <div className="px-8 pb-8 relative">
          <div className="-mt-16 mb-4 flex justify-between items-end">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-xl bg-gray-100 overflow-hidden">
                {profile_image_url ? (
                  <img
                    src={profile_image_url}
                    className="w-full h-full object-cover"
                    alt={name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                )}
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
          <p className="text-gray-500 font-medium">
            {position} • {department}
          </p>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Mail size={16} className="text-gray-400" /> {email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CalendarDays size={16} className="text-gray-400" /> Joined{" "}
                {startDate}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-100">
                <div className="text-xs text-gray-400 font-bold uppercase">
                  Category
                </div>
                <div className="font-medium text-gray-800">{category}</div>
              </div>
              <div className="p-4 rounded-xl border border-gray-100">
                <div className="text-xs text-gray-400 font-bold uppercase">
                  Gender
                </div>
                <div className="font-medium text-gray-800">{gender}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
