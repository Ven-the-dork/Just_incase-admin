// src/pages/user/profile/components/ProfileHeaderCard.jsx
import { User, Camera, ArrowLeft } from "lucide-react";

export default function ProfileHeaderCard({
  profileImageUrl,
  name,
  position,
  department,
  uploading,
  onBack,
  onFileChange,
}) {
  return (
    <>
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100">
        {/* Header Banner */}
        <div className="relative h-32 bg-gradient-to-r from-green-600 to-green-500">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-white p-1.5 shadow-xl">
                <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User size={48} />
                    </div>
                  )}
                </div>
              </div>

              {/* Camera Button */}
              <label className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-lg shadow-lg cursor-pointer transition-colors group">
                {uploading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Camera
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Top text */}
        <div className="pt-20 px-8 pb-4">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {name || "Your Name"}
            </h1>
            <p className="text-gray-500 mt-1">
              {position} • {department}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
