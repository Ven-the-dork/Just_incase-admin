// src/features/auth/hooks/useAdminLogin.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { logAudit } from "../../../utils/auditLog";
import { fetchEmployeeByFirebaseUid } from "../../../services/employeeService";

export function useAdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdminLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      let employee;
      try {
        employee = await fetchEmployeeByFirebaseUid(firebaseUser.uid);
      } catch {
        employee = null;
      }

      if (!employee) {
        setError("User not found in database");
        await auth.signOut();
        return;
      }

      if (employee.role !== "admin") {
        setError("Access Denied: Admin credentials required");
        await auth.signOut();
        return;
      }

      await logAudit({
        action: "admin_login",
        details: `Admin logged in: ${employee.full_name} (${employee.position}, ${employee.department})`,
        currentUser: {
          employeeId: employee.id,
          uid: firebaseUser.uid,
          fullName: employee.full_name,
          email: firebaseUser.email,
        },
      });

      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        fullName: employee.full_name,
        position: employee.position,
        department: employee.department,
        role: employee.role,
        employeeId: employee.id,
        can_view_payroll: employee.can_view_payroll || false,
      };
      sessionStorage.setItem("user", JSON.stringify(userData));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    loading,
    handleAdminLogin,
  };
}
