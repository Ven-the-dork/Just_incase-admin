// src/features/dashboard/pages/DashboardUser.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { supabase } from "../../../supabaseClient"; // ✅ ADDED

import UserTopBar from "../../../components/UserTopBar";
import FAQModal from "../../../components/FAQModal";
import { useUserNotifications } from "../../../components/hooks/useUserNotifications";

import {
  LayoutGrid,
  Receipt,
  HelpCircle,
  User,
  Calendar,
  Clock,
  X,
} from "lucide-react";

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

import { clockifyClockIn } from "../../../utils/clockifyClient";

import UserHeroCard from "../components/UserHeroCard";
import UserQuickActions from "../components/UserQuickActions";
import LeaveBalanceCard from "../components/LeaveBalanceCard";
import UserPayrollHistory from "../components/UserPayrollHistory";

const DEFAULT_PROFILE = {
  name: "Abercener Iakobo",
  email: "abercener@example.com",
  department: "HR",
  role: "Manager",
  contact: "+63 900 000 0000",
  address: "123 Main Street, City",
};

const TZ = "Asia/Singapore";

function getSgShiftDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const map = {};
  for (const p of parts) if (p.type !== "literal") map[p.type] = p.value;
  return `${map.year}-${map.month}-${map.day}`;
}

function toUserMessage(err) {
  const raw = err?.message || err?.error_description || err?.error || "";
  const msg = String(raw).toLowerCase();

  if (msg.includes("not logged in"))
    return "Session expired. Please log in again.";
  if (msg.includes("failed to fetch"))
    return "Network error. Check your internet and try again.";
  if (msg.includes("already clocked in")) return "Already clocked in today.";
  if (msg.includes("clockify api call failed"))
    return "Clockify is unavailable right now. Try again in a moment.";

  return raw || "Something went wrong. Please try again.";
}

export default function DashboardUser() {
  const navigate = useNavigate();

  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  const [currentUser, setCurrentUser] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeCategory, setEmployeeCategory] = useState(null); // ✅ ADDED

  const [hasClockedInToday, setHasClockedInToday] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);

  const [clockLoading, setClockLoading] = useState(false);

  const [leaveOptions, setLeaveOptions] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState({});
  const [loadingLeaves, setLoadingLeaves] = useState(true);

  const [notifOpen, setNotifOpen] = useState(false);
  const { notifications, unreadCount, markAllRead } = useUserNotifications(
    employeeId,
    notifOpen
  );

  // Load user from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) return;

    try {
      const user = JSON.parse(stored);
      setCurrentUser(user);

      setProfile((prev) => ({
        ...prev,
        name: user.fullName || prev.name,
        role: user.position || prev.role,
        department: user.department || prev.department,
        email: user.email || prev.email,
      }));

      if (user.employeeId) setEmployeeId(user.employeeId);
    } catch {
      // ignore parse errors
    }
  }, []);

  // Fallback: resolve employeeId from firebase uid
  useEffect(() => {
    const loadEmployeeId = async () => {
      if (employeeId) return;
      if (!currentUser?.uid) return;

      try {
        const id = await fetchEmployeeIdByFirebaseUid(currentUser.uid);
        if (id) setEmployeeId(id);
      } catch (error) {
        console.error("Failed to resolve employeeId:", error);
      }
    };

    loadEmployeeId();
  }, [currentUser, employeeId]);

  // ✅ NEW: Fetch employee category from database
  useEffect(() => {
    const fetchCategory = async () => {
      if (!employeeId) return;
      try {
        const { data, error } = await supabase
          .from("employees")
          .select("category")
          .eq("id", employeeId)
          .single();
        
        if (error) throw error;
        if (data) setEmployeeCategory(data.category);
      } catch (err) {
        console.error("Failed to fetch employee category:", err);
      }
    };
    fetchCategory();
  }, [employeeId]);

  // Sync clock status
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

  // Heartbeat online/offline
  useEffect(() => {
    if (!employeeId) return;

    const heartbeat = async () => {
      try {
        await markEmployeeOnline(employeeId);
      } catch (err) {
        console.error("Heartbeat error:", err);
      }
    };

    heartbeat();
    const interval = setInterval(heartbeat, 30_000);

    const goOffline = async () => {
      try {
        await markEmployeeOffline(employeeId);
      } catch (err) {
        console.error("Offline update error:", err);
      }
    };

    window.addEventListener("beforeunload", goOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", goOffline);
    };
  }, [employeeId]);

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const handleClockIn = async () => {
    if (clockLoading) return;
    
    if (hasClockedInToday) {
      setAttendanceMessage("Already clocked in today.");
      return;
    }

    // Check if today is Sunday
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    if (dayOfWeek === 0) {
      setAttendanceMessage("Clock in is not allowed on Sundays. Please try again on a weekday.");
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

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ UPDATED: Fetch leave plans - filtered by employee category
  useEffect(() => {
    async function fetchLeaveOptions() {
      if (!employeeCategory) return; // Wait for category
      
      setLoadingLeaves(true);
      try {
        const plans = await fetchLeavePlans();
        
        // Filter: Job Order only sees unpaid leaves
        const filteredPlans = employeeCategory === "Job Order"
          ? plans.filter(plan => plan.is_paid === false)
          : plans; // Regular sees all
        
        setLeaveOptions(
          filteredPlans.map((row) => ({
            id: row.id,
            label: row.name,
            days: row.duration_days,
          }))
        );
      } catch (error) {
        console.error("Error fetching leave plans:", error);
        setLeaveOptions([]);
      } finally {
        setLoadingLeaves(false);
      }
    }

    fetchLeaveOptions();
  }, [employeeCategory]); // ✅ CHANGED: Depend on employeeCategory

  // Calculate leave balances
  useEffect(() => {
    async function calculateBalances() {
      if (!currentUser?.uid || leaveOptions.length === 0) return;

      try {
        const applications = await fetchUserLeaveApplications(currentUser.uid);

        const usage = {};
        (applications || []).forEach((app) => {
          usage[app.leave_plan_id] =
            (usage[app.leave_plan_id] || 0) + app.duration_days;
        });

        const newBalances = {};
        leaveOptions.forEach((plan) => {
          const used = usage[plan.id] || 0;
          newBalances[plan.id] = Math.max(0, plan.days - used);
        });

        setLeaveBalances(newBalances);
      } catch (error) {
        console.error("Error fetching leave usage:", error);
      }
    }

    calculateBalances();
  }, [currentUser, leaveOptions]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
        <nav className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <ul className="hidden sm:flex space-x-8 text-sm font-semibold text-gray-500">
            <li
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === "dashboard"
                  ? "text-green-700"
                  : "hover:text-green-600"
              }`}
            >
              <LayoutGrid size={18} />
              <span>Dashboard</span>
            </li>

            <li
              onClick={() => setActiveTab("payroll")}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === "payroll"
                  ? "text-green-700"
                  : "hover:text-green-600"
              }`}
            >
              <Receipt size={18} />
              <span>Payroll History</span>
            </li>

            <li
              onClick={() => setFaqOpen(true)}
              className="flex items-center gap-2 cursor-pointer hover:text-green-600 transition-colors"
            >
              <HelpCircle size={18} />
              <span>FAQ</span>
            </li>
          </ul>

          <UserTopBar
            notifOpen={notifOpen}
            setNotifOpen={setNotifOpen}
            unreadCount={unreadCount}
            notifications={notifications}
            onMarkAllRead={markAllRead}
            onLogout={handleLogout}
            onOpenProfileModal={() => navigate("/profile")}
          />
        </nav>
      </header>

      {/* MAIN */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UserHeroCard
              profile={profile}
              hasClockedInToday={hasClockedInToday}
              attendanceMessage={attendanceMessage}
              onOpenFaq={() => setFaqOpen(true)}
            />

            <UserQuickActions
              quickActions={quickActions}
              clockLoading={clockLoading}
              hasClockedInToday={hasClockedInToday}
            />

            <LeaveBalanceCard
              leaveOptions={leaveOptions}
              leaveBalances={leaveBalances}
              loadingLeaves={loadingLeaves}
            />
          </div>
        )}

        {activeTab === "payroll" && (
          <UserPayrollHistory employeeId={employeeId} />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2026 CVSU. All rights reserved.
          </p>
        </div>
      </footer>

      {/* MODALS */}
      {profileModalOpen && (
        <ProfileModal
          onClose={() => setProfileModalOpen(false)}
          profile={profile}
          onChange={handleProfileChange}
        />
      )}

      <FAQModal open={faqOpen} onClose={() => setFaqOpen(false)} />
    </div>
  );
}

/* ProfileModal stays here or can be moved to components/ProfileModal.jsx */

function ProfileModal({ onClose, profile, onChange }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition rounded-full p-1 hover:bg-red-50"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form className="space-y-4">
          {/* form fields unchanged */}
        </form>
      </div>
    </div>
  );
}
