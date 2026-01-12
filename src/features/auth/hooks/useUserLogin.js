// src/features/auth/hooks/useUserLogin.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { fetchEmployeeByFirebaseUid } from "../../../services/employeeService";

export function useUserLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // secret logo click logic


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1) Firebase auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );
      const user = userCredential.user;

      // 2) Fetch employee profile from Supabase
      let userProfile;
      try {
        userProfile = await fetchEmployeeByFirebaseUid(user.uid);
      } catch {
        userProfile = null;
      }

      if (!userProfile) {
        await signOut(auth);
        throw new Error(
          "User profile not found in database. Please contact administrator."
        );
      }

      // 3) Block admins on this form (user login only)
      if (userProfile.role === "admin") {
        setError("Invalid user account");
        await signOut(auth);
        return;
      }

      // 4) Block soft-deleted / disabled employees
      if (userProfile.is_disabled) {
        await signOut(auth);
        throw new Error(
          "Your account is inactive. Please contact the administrator."
        );
      }

      // 5) Store session and navigate
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          role: userProfile.role,
          fullName: userProfile.full_name,
          department: userProfile.department,
          position: userProfile.position,
          employeeId: userProfile.id,
          can_view_payroll: userProfile.can_view_payroll || false,
        })
      );

      navigate("/dashboard_user");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address format.");
      } else if (err.code === "auth/too-many-requests") {
        setError(
          "Too many failed login attempts. Please try again later."
        );
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "Failed to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  };
}
