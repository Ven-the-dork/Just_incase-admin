import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const stored = sessionStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
