// src/pages/user/profile/components/LoadingScreen.jsx
export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600 mb-4" />
        <p className="text-gray-600 font-medium">Loading profile...</p>
      </div>
    </div>
  );
}
