import { useState } from 'react';
import { auth } from '../../../firebaseConfig';
import { supabase } from '../../../supabaseClient';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Check if email exists in Supabase employees table
      const { data: employee, error: supabaseError } = await supabase
        .from('employees')
        .select('email, last_password_reset_at')
        .eq('email', email)
        .single();

      if (supabaseError || !employee) {
        setError('No employee account found with this email address.');
        setLoading(false);
        return;
      }

      // Check 24-hour limit
      const now = Date.now();
      if (employee.last_password_reset_at) {
        const last = new Date(employee.last_password_reset_at).getTime();
        const diffHours = (now - last) / (1000 * 60 * 60);
        if (diffHours < 24) {
          const remainingHours = Math.ceil(24 - diffHours);
          setError(`You can request a password reset again in ${remainingHours} hour(s).`);
          setLoading(false);
          return;
        }
      }

      // Send Firebase password reset email
      await sendPasswordResetEmail(auth, email);

      // Update last reset timestamp
      await supabase
        .from('employees')
        .update({ last_password_reset_at: new Date().toISOString() })
        .eq('email', email);

      setMessage('Password reset email sent! Please check your inbox.');
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else if (err.code === 'auth/missing-email') {
        setError('Please enter an email address.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    message,
    error,
    handleSubmit,
  };
};
