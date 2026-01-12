// src/features/auth/components/LoginForm.jsx
import { Link } from 'react-router-dom'; // ADD THIS IMPORT!

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  onSubmit,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8">
      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
        Login
      </h2>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your Email"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
          />
        </div>
        
        {error && (
          <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
            ⚠️ {error}
          </div>
        )}

        <div className="text-right">
          <Link 
            to="/forgot-password"
            className="text-sm text-green-700 hover:text-green-900 hover:underline font-semibold"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-green-600 text-black hover:text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Need help? Contact your administrator
        </p>
      </div>
    </div>
  );
}
