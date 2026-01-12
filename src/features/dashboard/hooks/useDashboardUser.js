// src/features/dashboard/hooks/useDashboardUser.js
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { clockifyClockIn } from "../../../utils/clockifyClient";
import {
  fetchEmployeeIdByFirebaseUid,
  markEmployeeOnline,
  markEmployeeOffline,
} from "../../../services/employeeService";
import {
  fetchLeavePlans,
  fetchUserLeaveApplications,
} from "../../../services/leaveService";
import { hasAttendanceToday } from "../../../services/attendanceService";

const DEFAULT_PROFILE = { /* same as before */ };
const TZ = "Asia/Singapore";

function getSgShiftDate(date = new Date()) { /* same helper */ }
function toUserMessage(err) { /* same helper */ }

export function useDashboardUser() {
  const navigate = useNavigate();

  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [currentUser, setCurrentUser] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [hasClockedInToday, setHasClockedInToday] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [clockLoading, setClockLoading] = useState(false);

  const [leaveOptions, setLeaveOptions] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState({});
  const [loadingLeaves, setLoadingLeaves] = useState(true);

  const [notifOpen, setNotifOpen] = useState(false);

  // load user from sessionStorage (same as now)
  useEffect(() => { /* set currentUser, profile, employeeId */ }, []);

  // fallback employeeId
  useEffect(() => { /* fetchEmployeeIdByFirebaseUid */ }, [currentUser, employeeId]);

  const syncClockStatus = useCallback(async () => {
    if (!employeeId) return;
    const todayShiftDate = getSgShiftDate(new Date());
    try {
      const has = await hasAttendanceToday(employeeId, todayShiftDate);
      setHasClockedInToday(has);
    } catch (error) {
      console.error("Failed to sync clock status:", error);
    }
  }, [employeeId]);

  useEffect(() => {
    syncClockStatus();
  }, [syncClockStatus]);

  // heartbeat online/offline (same)
  useEffect(() => { /* markEmployeeOnline / markEmployeeOffline */ }, [employeeId]);

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const handleClockIn = async () => {
    if (clockLoading || hasClockedInToday) {
      if (hasClockedInToday) setAttendanceMessage("Already clocked in today.");
      return;
    }

    setClockLoading(true);
    setAttendanceMessage("");

    try {
      const res = await clockifyClockIn();
      setAttendanceMessage(res?.message ?? "Clock in processed.");
      await syncClockStatus();
    } catch (err) {
      console.error("Clock in error:", err);
      setAttendanceMessage(toUserMessage(err));
    } finally {
      setClockLoading(false);
    }
  };

  const quickActions = [
    {
      label: "Clock in",
      onClick: handleClockIn,
      isClockAction: true,
      icon: <Clock size={20} />,
    },
    {
      label: "Apply for Leave",
      onClick: () => navigate("/applyforleave"),
      icon: <Calendar size={20} />,
    },
    {
      label: "Update Profile",
      onClick: () => navigate("/profile"),
      icon: <User size={20} />,
    },
  ];

  const handleProfileChange = (e) => { /* same */ };

  // fetchLeaveOptions + calculateBalances (same useEffects)

  return {
    attendanceMessage,
    activeTab,
    setActiveTab,
    profileModalOpen,
    setProfileModalOpen,
    profile,
    handleProfileChange,
    currentUser,
    employeeId,
    hasClockedInToday,
    faqOpen,
    setFaqOpen,
    clockLoading,
    leaveOptions,
    leaveBalances,
    loadingLeaves,
    notifOpen,
    setNotifOpen,
    handleLogout,
    quickActions,
  };
}
