import React from 'react';
import { useForgotPassword } from '../hooks/useForgotPassword';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import logo from '../../../assets/cvsu.png';

const ForgotPassword = () => {
  const {
    email,
    setEmail,
    loading,
    message,
    error,
    handleSubmit,
  } = useForgotPassword();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-green-600">
      <div className="w-full max-w-md mx-4">
        {/* Header with logo and title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="h-24 w-24" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Employee Portal</h1>
          <p className="text-white text-sm">Please enter your email to reset password</p>
        </div>

        {/* Form Component */}
        <ForgotPasswordForm
          email={email}
          setEmail={setEmail}
          loading={loading}
          message={message}
          error={error}
          onSubmit={handleSubmit}
        />

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white text-xs">© 2025 Employee Management System</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
