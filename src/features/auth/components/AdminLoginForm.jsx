// src/features/auth/components/AdminLoginForm.jsx
import { Lock } from "lucide-react";

export default function AdminLoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  error,
  loading,
  onSubmit,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-yellow-400">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-700 mb-4">
          <Lock size={32} className="text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold text-green-900 mb-2">
          Secure Access
        </h2>
        <p className="text-sm text-gray-600">
          Administrator authentication required
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-green-900 mb-2">
            Admin Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all bg-gray-50"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-green-900 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all bg-gray-50 pr-1"
              required
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <span className="text-xl">⚠️</span>
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? "Authenticating..." : "Login as Admin"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          🔒 This is a secure admin-only area
        </p>
      </div>
    </div>
  );
}
