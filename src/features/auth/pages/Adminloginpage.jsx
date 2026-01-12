// src/features/auth/pages/AdminLoginPage.jsx
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminLogin } from "../hooks/useAdminLogin";
import AdminLoginForm from "../components/AdminLoginForm";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    loading,
    handleAdminLogin,
  } = useAdminLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-green-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-400 shadow-lg mb-4">
            <Shield size={40} className="text-green-900" />
          </div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">
            ADMIN PORTAL
          </h1>
        </div>

        <AdminLoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          error={error}
          loading={loading}
          onSubmit={handleAdminLogin}
        />


      </div>
    </div>
  );
}
