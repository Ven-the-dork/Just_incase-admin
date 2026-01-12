import React from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordForm({
  email,
  setEmail,
  loading,
  message,
  error,
  onSubmit,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8">
      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
        Forgot Password?
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
            placeholder="Enter your email"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition bg-gray-50"
          />
        </div>

        {message && (
          <div className="bg-green-50 border-2 border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm font-semibold">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold">
            ⚠️ {error}
          </div>
        )}

        <div className="text-right">
          <Link
            to="/"
            className="text-sm text-green-700 hover:text-green-900 font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
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
