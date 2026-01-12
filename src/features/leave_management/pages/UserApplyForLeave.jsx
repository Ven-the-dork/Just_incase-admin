// src/features/leave/pages/UserApplyForLeave.jsx
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { supabase } from "../../../supabaseClient";

import UserTopBar from "../../../components/UserTopBar";
import { useUserNotifications } from "../../../components/hooks/useUserNotifications";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import {
  fetchEmployeeIdByFirebaseUid,
  markEmployeeOnline,
  markEmployeeOffline,
} from "../../../services/employeeService";
import {
  fetchLeavePlans,
  fetchUserLeaveApplications,
  fetchUserLeaveHistory,
  insertLeaveApplication,
} from "../../../services/leaveService";

import LeaveTypeCard from "../components/LeaveTypeCard";
import LeaveApplicationModal from "../components/LeaveApplicationModal";
import UserLeaveHistoryTable from "../components/UserLeaveHistoryTable";

// same helper as before (used only in submit logic)
function calculateDuration(start, end) {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);
  if (endDate < startDate) return 0;

  let count = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
}

export default function UserApplyForLeave() {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const [leaveOptions, setLeaveOptions] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);

  const [leaveBalances, setLeaveBalances] = useState({});

  const [notifOpen, setNotifOpen] = useState(false);
  const { notifications, unreadCount, markAllRead } = useUserNotifications(
    employeeId,
    notifOpen
  );

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard_user");
  };

  function openModal(leaveType) {
    setSelectedLeave(leaveType);
    setModalOpen(true);
    setStartDate("");
    setEndDate("");
    setReason("");
    setAttachment(null);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedLeave(null);
    setStartDate("");
    setEndDate("");
    setReason("");
    setAttachment(null);
  }

  // Load user + employeeId
  useEffect(() => {
    async function loadUser() {
      const stored = sessionStorage.getItem("user");
      if (!stored) return;

      try {
        const user = JSON.parse(stored);
        setCurrentUser(user);

        const id = await fetchEmployeeIdByFirebaseUid(user.uid);
        if (id) setEmployeeId(id);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    }
    loadUser();
  }, []);

  // Heartbeat
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
    const interval = setInterval(heartbeat, 30000);

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
      goOffline();
    };
  }, [employeeId]);

  // Fetch leave plans
  useEffect(() => {
    async function loadLeaveOptions() {
      setLoadingLeaves(true);
      try {
        const plans = await fetchLeavePlans();
        setLeaveOptions(
          plans.map((row) => ({
            id: row.id,
            label: row.name,
            days: row.duration_days,
          }))
        );
      } catch (error) {
        console.error("Error loading leave plans:", error);
        setLeaveOptions([]);
      } finally {
        setLoadingLeaves(false);
      }
    }

    loadLeaveOptions();
  }, []);

  // Fetch leave history
  useEffect(() => {
    async function loadLeaveHistory() {
      if (!currentUser?.uid) return;

      setLoadingHistory(true);
      try {
        const history = await fetchUserLeaveHistory(currentUser.uid);
        setLeaveHistory(history);
      } catch (error) {
        console.error("Error fetching leave history:", error);
        setLeaveHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    }

    loadLeaveHistory();
  }, [currentUser]);

  // Calculate balances
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
  }, [currentUser, leaveOptions, leaveHistory]);

  // Submit leave application
  async function handleSubmitApplication(e) {
    e.preventDefault();

    if (!startDate || !endDate || !reason) {
      setErrorMessage("Please fill in all fields.");
      setShowErrorToast(true);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < today || end < today) {
      setErrorMessage("You cannot apply for leave in the past.");
      setShowErrorToast(true);
      return;
    }

    if (end < start) {
      setErrorMessage("End date must be after start date.");
      setShowErrorToast(true);
      return;
    }

    if (!currentUser?.uid) {
      setErrorMessage("Session issue. Please log in again.");
      setShowErrorToast(true);
      return;
    }

    if (!employeeId) {
      setErrorMessage("Employee record not found. Please contact administrator.");
      setShowErrorToast(true);
      return;
    }

    setSubmitting(true);

    const duration = calculateDuration(startDate, endDate);
    const currentBalance = leaveBalances[selectedLeave.id] ?? selectedLeave.days;

    if (duration > currentBalance) {
      setErrorMessage(
        `Insufficient leave balance. You only have ${currentBalance} days left.`
      );
      setShowErrorToast(true);
      setSubmitting(false);
      return;
    }

    // Overlap check
    try {
      const { data: existingConflicts, error: conflictError } = await supabase
        .from("leave_applications")
        .select("start_date, end_date")
        .eq("firebase_uid", currentUser.uid)
        .in("status", ["pending", "approved"])
        .lte("start_date", endDate)
        .gte("end_date", startDate);

      if (conflictError) throw conflictError;

      if (existingConflicts && existingConflicts.length > 0) {
        setErrorMessage(
          "You already have a leave application that overlaps these dates."
        );
        setShowErrorToast(true);
        setSubmitting(false);
        return;
      }
    } catch (err) {
      console.error("Error checking conflicts:", err);
      setErrorMessage("Failed to validate leave dates. Please try again.");
      setShowErrorToast(true);
      setSubmitting(false);
      return;
    }

    // File upload (Supabase)
    let attachmentUrl = null;
    if (attachment) {
      try {
        const fileExt = attachment.name.split(".").pop();
        const fileName = `${currentUser.uid}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("leave_attachments")
          .upload(fileName, attachment);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("leave_attachments")
          .getPublicUrl(fileName);

        attachmentUrl = urlData.publicUrl;
      } catch (uploadErr) {
        console.error("Upload error:", uploadErr);
        setErrorMessage(
          "Failed to upload file. Please check your network or file size."
        );
        setShowErrorToast(true);
        setSubmitting(false);
        return;
      }
    }

    const payload = {
      employee_id: employeeId,
      firebase_uid: currentUser.uid,
      leave_plan_id: selectedLeave.id,
      start_date: startDate,
      end_date: endDate,
      duration_days: duration,
      reason,
      status: "pending",
      admin_seen: false,
      attachment_url: attachmentUrl,
    };

    try {
      await insertLeaveApplication(payload);

      setSuccessMessage("Leave application submitted successfully!");
      setShowSuccessToast(true);
      closeModal();

      const history = await fetchUserLeaveHistory(currentUser.uid);
      setLeaveHistory(history);
    } catch (error) {
      console.error("Error submitting:", error);
      setErrorMessage("Failed to submit leave. Please try again.");
      setShowErrorToast(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
        <nav className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToDashboard}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-green-700 transition"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Apply for Leave
            </h1>
          </div>

          <UserTopBar
            notifOpen={notifOpen}
            setNotifOpen={setNotifOpen}
            unreadCount={unreadCount}
            notifications={notifications}
            onMarkAllRead={markAllRead}
            onLogout={handleLogout}
          />
        </nav>
      </header>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Leave types */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="text-green-600" size={20} />
              Select Leave Type
            </h2>
            <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
              Balances include pending requests
            </span>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:px-8 sm:py-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            {loadingLeaves ? (
              <div className="py-12 text-center text-gray-400 animate-pulse">
                Loading leave plans...
              </div>
            ) : leaveOptions.length === 0 ? (
              <div className="py-12 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100">
                No leave plans available. Please contact HR.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {leaveOptions.map((opt) => (
                  <LeaveTypeCard
                    key={opt.id}
                    days={opt.days}
                    label={opt.label}
                    remaining={leaveBalances[opt.id]}
                    onApply={() => openModal(opt)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* History table */}
        <UserLeaveHistoryTable
          history={leaveHistory}
          loading={loadingHistory}
        />
      </main>

      {/* Modal */}
      {modalOpen && selectedLeave && (
        <LeaveApplicationModal
          onClose={closeModal}
          leaveType={selectedLeave}
          remainingBalance={
            leaveBalances[selectedLeave.id] ?? selectedLeave.days
          }
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          reason={reason}
          setReason={setReason}
          attachment={attachment}
          setAttachment={setAttachment}
          onSubmit={handleSubmitApplication}
          submitting={submitting}
        />
      )}

      {/* Success Toast */}
      <SuccessToast
        isOpen={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Error Toast */}
      <ErrorToast
        isOpen={showErrorToast}
        message={errorMessage}
        onClose={() => setShowErrorToast(false)}
      />
    </div>
  );
}
