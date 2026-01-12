// src/pages/user/profile/components/ProfileForm.jsx
import {
  User,
  Mail,
  Briefcase,
  Phone,
  MapPin,
  Save,
} from "lucide-react";

export default function ProfileForm({
  profile,
  saving,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100 mt-4">
      <div className="px-8 pb-8">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4 mt-2">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <User size={18} className="text-green-700" />
              </div>
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    name="email"
                    value={profile.email}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                    title="Email cannot be changed"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Email cannot be modified
                </p>
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 bg-yellow-100 rounded-lg">
                <Briefcase size={18} className="text-yellow-700" />
              </div>
              Job Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Department
                </label>
                <input
                  name="department"
                  value={profile.department}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  placeholder="e.g., Human Resources"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Position
                </label>
                <input
                  name="position"
                  value={profile.position}
                  onChange={onChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  placeholder="e.g., Manager"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Phone size={18} className="text-blue-700" />
              </div>
              Contact Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    name="contact"
                    value={profile.contact}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                    placeholder="+63 900 000 0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <MapPin size={18} className="text-gray-400" />
                  </div>
                  <input
                    name="address"
                    value={profile.address}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                    placeholder="123 Main Street, City"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-xl font-bold shadow-lg shadow-green-200 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
