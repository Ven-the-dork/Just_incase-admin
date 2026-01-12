// src/features/dashboard/hooks/useAdminDashboard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { fetchDashboardStats } from "../../../services/dashboardService";

export function useAdminDashboard() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [employeeCount, setEmployeeCount] = useState(0);
  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);
  const [loadingCounts, setLoadingCounts] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) return;
    try {
      setCurrentUser(JSON.parse(stored));
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    let interval;

    async function loadCounts() {
      setLoadingCounts(true);
      try {
        const { employeeCount, pendingLeavesCount } = await fetchDashboardStats();
        setEmployeeCount(employeeCount);
        setPendingLeavesCount(pendingLeavesCount);
      } finally {
        setLoadingCounts(false);
      }
    }

    loadCounts();
    interval = setInterval(loadCounts, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    isOpen,
    setIsOpen,
    currentUser,
    employeeCount,
    pendingLeavesCount,
    loadingCounts,
    handleLogout,
    currentTime,
    navigate,
  };
}
