// src/features/leave/pages/LeaveManagement.jsx
import { useState, useEffect } from "react";
import { Menu, Settings, Calendar, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

import AdminBell from "../../../components/AdminBell";
import AdminSidebar from "../components/Leavedashvar";
import FontSizeMenu from "../../../components/hooks/FontSizeMenu";
import AdminSetting from "../../../components/Adminsetting";
import DeletePlanModal from "../components/DeletePlanModal";
import SuccessToast from "../components/SuccessToast";
import ApproveLeaveModal from "../components/ApproveLeaveModal";
import RejectLeaveModal from "../components/RejectLeaveModal";

import {
  fetchLeavePlans,
  fetchAdminLeaveApplications,
  fetchOngoingRecallableLeaves,
  createLeavePlan,
  updateLeavePlan,
  softDeleteLeavePlan,
  updateLeaveStatus,
  getLeaveApplicationForNotification,
  insertNotification,
} from "../../../services/leaveService";

import LeaveHistoryPanel from "../components/LeaveHistoryPanel";
import LeaveSettingsPanel from "../components/LeaveSettingsPanel";
import LeaveRecallPanel from "../components/LeaveRecallPanel";
import RecallModal from "../components/Recallmodal";

export default function LeaveManagement() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("history");
  const [currentUser, setCurrentUser] = useState(null);

  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);

  const [leavePlans, setLeavePlans] = useState([]);

  const [ongoingLeaves, setOngoingLeaves] = useState([]);
  const [loadingOngoing, setLoadingOngoing] = useState(true);

  // Create form
  const [leavePlanName, setLeavePlanName] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [allowRecall, setAllowRecall] = useState("");
  const [isPaid, setIsPaid] = useState(""); // ✅ ADDED

  // Edit plan
  const [editingPlan, setEditingPlan] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editAllowRecall, setEditAllowRecall] = useState("");
  const [editIsPaid, setEditIsPaid] = useState(""); // ✅ ADDED
  const [openDropdown, setOpenDropdown] = useState(null);

  // Recall modal
  const [showRecallModal, setShowRecallModal] = useState(false);
  const [selectedRecallLeave, setSelectedRecallLeave] = useState(null);
  const [recallNewResumptionDate, setRecallNewResumptionDate] = useState("");
  const [recallReasonText, setRecallReasonText] = useState("");
  const [submittingRecall, setSubmittingRecall] = useState(false);

  // Delete Pop up modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [isDeletingPlan, setIsDeletingPlan] = useState(false);

  // Success popup modal
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Approve/Reject modals
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isApprovingLeave, setIsApprovingLeave] = useState(false);
  const [isRejectingLeave, setIsRejectingLeave] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const createLeaveNotification = async ({
    employeeId,
    leaveApplicationId,
    type,
    title,
    message,
  }) => {
    if (!employeeId || !leaveApplicationId) return;
    try {
      await insertNotification({
        employee_id: employeeId,
        leave_application_id: leaveApplicationId,
        type,
        title,
        message,
      });
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  };

  // Load current user from session
  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  // Fetch leave plans
  useEffect(() => {
    async function loadPlans() {
      try {
        const plans = await fetchLeavePlans();
        setLeavePlans(plans);
      } catch (error) {
        console.error(error);
      }
    }
    loadPlans();
  }, []);

  // Fetch applications
  useEffect(() => {
    async function loadApplications() {
      setLoadingApplications(true);
      try {
        const apps = await fetchAdminLeaveApplications();
        setLeaveApplications(apps);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingApplications(false);
      }
    }
    loadApplications();
  }, []);

  // Fetch ongoing recallable leaves
  useEffect(() => {
    async function loadOngoing() {
      setLoadingOngoing(true);
      try {
        const today = new Date().toISOString().split("T")[0];
        const rows = await fetchOngoingRecallableLeaves(today);
        setOngoingLeaves(rows);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingOngoing(false);
      }
    }
    loadOngoing();
  }, []);

  // ✅ UPDATED: Create with isPaid
  async function handleCreateLeaveSetting(e) {
    e.preventDefault();
    if (!leavePlanName || !durationDays || !isPaid) {
      alert("Please fill in all fields including Paid Leave option");
      return;
    }

    const payload = {
      name: leavePlanName,
      duration_days: Number(durationDays),
      is_active: true,
      allow_recall: allowRecall === "Yes",
      is_paid: isPaid === "Yes", // ✅ ADDED
    };

    try {
      const data = await createLeavePlan(payload);
      setLeavePlans((prev) => [...prev, data]);

      setSuccessMessage(`Leave plan "${leavePlanName}" created successfully!`);
      setShowSuccessToast(true);

      // Clear form
      setLeavePlanName("");
      setDurationDays("");
      setAllowRecall("");
      setIsPaid(""); // ✅ ADDED
    } catch (error) {
      console.error(error);
      alert("Failed to create leave plan");
    }
  }

  // Open approve modal
  function handleApproveLeaveClick(application) {
    setSelectedApplication(application);
    setShowApproveModal(true);
  }

  // Confirm approve
  async function confirmApproveLeave() {
    if (!selectedApplication) return;

    setIsApprovingLeave(true);
    try {
      const applicationId = selectedApplication.id;

      if (!applicationId) {
        throw new Error("Application ID is missing");
      }

      const appRow = await getLeaveApplicationForNotification(applicationId);

      await updateLeaveStatus(applicationId, {
        status: "approved",
        reviewed_at: new Date().toISOString(),
        reviewed_by: currentUser?.uid,
      });

      await createLeaveNotification({
        employeeId: appRow.employee_id,
        leaveApplicationId: appRow.id,
        type: "leave_approved",
        title: "Leave approved",
        message: `Your ${appRow.leave_plans?.name || "leave"} request was approved.`,
      });

      setLeaveApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: "approved" } : app
        )
      );

      setShowApproveModal(false);
      setSelectedApplication(null);

      setSuccessMessage("Leave application approved successfully!");
      setShowSuccessToast(true);
    } catch (error) {
      console.error("Error approving leave:", error);
      alert(`Failed to approve leave application: ${error.message}`);
    } finally {
      setIsApprovingLeave(false);
    }
  }

  // Open reject modal
  function handleRejectLeaveClick(application) {
    setSelectedApplication(application);
    setShowRejectModal(true);
  }

  // Confirm reject
  async function confirmRejectLeave() {
    if (!selectedApplication) return;

    setIsRejectingLeave(true);
    try {
      const applicationId = selectedApplication.id;

      if (!applicationId) {
        throw new Error("Application ID is missing");
      }

      const appRow = await getLeaveApplicationForNotification(applicationId);

      await updateLeaveStatus(applicationId, {
        status: "rejected",
        reviewed_at: new Date().toISOString(),
        reviewed_by: currentUser?.uid,
      });

      await createLeaveNotification({
        employeeId: appRow.employee_id,
        leaveApplicationId: appRow.id,
        type: "leave_declined",
        title: "Leave declined",
        message: `Your ${appRow.leave_plans?.name || "leave"} request was declined.`,
      });

      setLeaveApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: "rejected" } : app
        )
      );

      setShowRejectModal(false);
      setSelectedApplication(null);

      setSuccessMessage("Leave application rejected successfully!");
      setShowSuccessToast(true);
    } catch (error) {
      console.error("Error rejecting leave:", error);
      alert(`Failed to reject leave application: ${error.message}`);
    } finally {
      setIsRejectingLeave(false);
    }
  }

  // ✅ UPDATED: Start edit with isPaid
  function handleStartEdit(plan) {
    setEditingPlan(plan);
    setEditName(plan.name);
    setEditDuration(plan.duration_days);
    setEditAllowRecall(plan.allow_recall ? "Yes" : "No");
    setEditIsPaid(plan.is_paid ? "Yes" : "No"); // ✅ ADDED
    setOpenDropdown(null);
  }

  // ✅ UPDATED: Save edit with isPaid
  async function handleSaveEdit(e) {
    e.preventDefault();
    try {
      await updateLeavePlan(editingPlan.id, {
        name: editName,
        duration_days: Number(editDuration),
        allow_recall: editAllowRecall === "Yes",
        is_paid: editIsPaid === "Yes", // ✅ ADDED
      });

      setLeavePlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id
            ? {
                ...p,
                name: editName,
                duration_days: Number(editDuration),
                allow_recall: editAllowRecall === "Yes",
                is_paid: editIsPaid === "Yes", // ✅ ADDED
              }
            : p
        )
      );
      setEditingPlan(null);
      setSuccessMessage("Leave plan updated successfully!");
      setShowSuccessToast(true);
    } catch (error) {
      console.error(error);
      alert("Failed to update leave plan");
    }
  }

  // Open delete modal
  function handleDeleteLeavePlan(plan) {
    setPlanToDelete(plan);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  }

  // Confirm delete
  async function confirmDeletePlan() {
    if (!planToDelete) return;

    setIsDeletingPlan(true);
    try {
      await softDeleteLeavePlan(planToDelete.id);
      setLeavePlans((prev) => prev.filter((p) => p.id !== planToDelete.id));
      setShowDeleteModal(false);
      setPlanToDelete(null);

      setSuccessMessage(`Leave plan "${planToDelete.name}" deleted successfully!`);
      setShowSuccessToast(true);
    } catch (error) {
      console.error(error);
      alert("Failed to delete leave plan");
    } finally {
      setIsDeletingPlan(false);
    }
  }

  // Cancel delete
  function cancelDeletePlan() {
    setShowDeleteModal(false);
    setPlanToDelete(null);
  }

  function handleOpenRecallModal(leave) {
    setSelectedRecallLeave(leave);
    setRecallNewResumptionDate("");
    setRecallReasonText("");
    setShowRecallModal(true);
  }

  async function handleSubmitRecall(e) {
    e.preventDefault();
    if (!recallNewResumptionDate) {
      alert("Select date");
      return;
    }

    setSubmittingRecall(true);
    try {
      await updateLeaveStatus(selectedRecallLeave.id, {
        status: "recalled",
        reviewed_at: new Date().toISOString(),
      });

      await createLeaveNotification({
        employeeId: selectedRecallLeave.employee_id,
        leaveApplicationId: selectedRecallLeave.id,
        type: "leave_recalled",
        title: "Leave recalled",
        message: `Please resume on ${recallNewResumptionDate}.`,
      });

      setOngoingLeaves((prev) =>
        prev.filter((l) => l.id !== selectedRecallLeave.id)
      );
      setShowRecallModal(false);
      setSuccessMessage("Leave recalled successfully!");
      setShowSuccessToast(true);
    } catch (error) {
      console.error(error);
      alert("Failed to recall leave");
    } finally {
      setSubmittingRecall(false);
    }
  }

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans text-gray-800">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isOpen}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={(path) => navigate(path)}
      />

      <main className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "lg:ml-0" : ""}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen((s) => !s)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                Leave Management
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Manage employee time-off and policies
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-xs text-gray-400 font-medium">
              Last updated: {currentTime}
            </span>
            <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block" />
            <AdminBell />
            <AdminSetting
              trigger={
                <button className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200 flex items-center justify-center">
                  <Settings size={20} />
                </button>
              }
            >
              {({ close }) => <FontSizeMenu closeMenu={close} />}
            </AdminSetting>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Tabs */}
          <div className="flex justify-center mb-2">
            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm inline-flex">
              {["history", "recall", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-lg cursor-pointer text-sm font-bold transition-all ${
                    activeTab === tab
                      ? "bg-green-700 text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-50 hover:text-green-700"
                  }`}
                >
                  {tab === "history"
                    ? "Leave History"
                    : tab === "recall"
                    ? "Leave Recall"
                    : "Settings"}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          {activeTab === "history" && (
            <LeaveHistoryPanel
              applications={leaveApplications}
              loading={loadingApplications}
              onApprove={handleApproveLeaveClick}
              onReject={handleRejectLeaveClick}
            />
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <LeaveSettingsPanel
              leavePlans={leavePlans}
              leavePlanName={leavePlanName}
              durationDays={durationDays}
              allowRecall={allowRecall}
              isPaid={isPaid} // ✅ ADDED
              editingPlan={editingPlan}
              editName={editName}
              editDuration={editDuration}
              editAllowRecall={editAllowRecall}
              editIsPaid={editIsPaid} // ✅ ADDED
              openDropdown={openDropdown}
              onChangeLeavePlanName={setLeavePlanName}
              onChangeDurationDays={setDurationDays}
              onChangeAllowRecall={setAllowRecall}
              onChangeIsPaid={setIsPaid} // ✅ ADDED
              onCreate={handleCreateLeaveSetting}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={() => setEditingPlan(null)}
              onChangeEditName={setEditName}
              onChangeEditDuration={setEditDuration}
              onChangeEditAllowRecall={setEditAllowRecall}
              onChangeEditIsPaid={setEditIsPaid} // ✅ ADDED
              onDeletePlan={handleDeleteLeavePlan}
              setOpenDropdown={setOpenDropdown}
            />
          )}

          {/* Recall */}
          {activeTab === "recall" && (
            <LeaveRecallPanel
              ongoingLeaves={ongoingLeaves}
              loading={loadingOngoing}
              onRecall={handleOpenRecallModal} // ✅ FIXED: Changed from onOpenRecall to onRecall
            />
          )}
        </div>

        {/* ✅ FIXED: Recall Modal Props */}
        <RecallModal
          open={showRecallModal}
          leave={selectedRecallLeave}
          submitting={submittingRecall}
          newDate={recallNewResumptionDate}
          reason={recallReasonText}
          onChangeDate={setRecallNewResumptionDate}
          onChangeReason={setRecallReasonText}
          onSubmit={handleSubmitRecall}
          onClose={() => setShowRecallModal(false)}
        />

        {/* Delete Confirmation Modal */}
        <DeletePlanModal
          isOpen={showDeleteModal}
          planName={planToDelete?.name || ""}
          onConfirm={confirmDeletePlan}
          onCancel={cancelDeletePlan}
          isDeleting={isDeletingPlan}
        />

        {/* Approve Modal */}
        <ApproveLeaveModal
          isOpen={showApproveModal}
          employeeName={selectedApplication?.employees?.full_name || "Employee"}
          leaveType={selectedApplication?.leave_plans?.name || "Leave"}
          onConfirm={confirmApproveLeave}
          onCancel={() => setShowApproveModal(false)}
          isApproving={isApprovingLeave}
        />

        {/* Reject Modal */}
        <RejectLeaveModal
          isOpen={showRejectModal}
          employeeName={selectedApplication?.employees?.full_name || "Employee"}
          leaveType={selectedApplication?.leave_plans?.name || "Leave"}
          onConfirm={confirmRejectLeave}
          onCancel={() => setShowRejectModal(false)}
          isRejecting={isRejectingLeave}
        />

        {/* Success Toast */}
        <SuccessToast
          isOpen={showSuccessToast}
          message={successMessage}
          onClose={() => setShowSuccessToast(false)}
        />
      </main>
    </div>
  );
}
