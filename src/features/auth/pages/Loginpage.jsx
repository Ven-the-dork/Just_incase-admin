// src/features/auth/pages/LoginPage.jsx
import cvsuLogo from "../../../assets/cvsu.png";
import { useUserLogin } from "../hooks/useUserLogin";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  } = useUserLogin();

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-green-600 to-green-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img
            id="secret-logo"
            src={cvsuLogo}
            alt="Company Logo"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            Payroll Management System
          </h1>
          <p className="text-green-100 text-sm">
            Employee Portal
          </p>
        </div>

        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          error={error}
          onSubmit={handleLogin}
        />

        <div className="text-center mt-6">
          <p className="text-xs text-green-100 opacity-50">
            © 2026 Payroll Management System
          </p>
        </div>
      </div>
    </div>
  );
}


