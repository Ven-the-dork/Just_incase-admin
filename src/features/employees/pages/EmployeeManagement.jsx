// src/features/employee/pages/EmployeeManagement.jsx
import { useState, useEffect } from "react";
import { Menu, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { logAudit } from "../../../utils/auditLog";

import AdminBell from "../../../components/AdminBell";
import AdminSidebar from "../components/Employeesidebar";
import FontSizeMenu from "../../../components/hooks/FontSizeMenu";
import AdminSetting from "../../../components/Adminsetting";

import { fetchEmployees, insertEmployee, softDeleteEmployeeById } from "../../../services/employeeService";

import EmployeeStatsCards from "../components/EmployeeStatsCards";
import EmployeeTable from "../components/EmployeeTable";
import AddEmployeeDrawer from "../components/AddEmployeeDrawer";
import PasswordConfirmModal from "../components/PasswordConfirmModal";
import EmployeeProfileModal from "../components/EmployeeProfileModal";

export default function EmployeeManagement() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addEmployeeError, setAddEmployeeError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Password confirmation state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [verifyingPassword, setVerifyingPassword] = useState(false);

  // New employee form
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: "",
    position: "",
    startDate: "",
    category: "",
    gender: "",
    email: "",
    password: "",
    role: "user",
  });

  const [employeeData, setEmployeeData] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [employeesError, setEmployeesError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField] = useState("full_name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleLogout = async () => {
    try {
      await logAudit({
        action: "admin_logout",
        details: `Admin logged out: ${currentUser?.fullName} (${currentUser?.position}, ${currentUser?.department})`,
        currentUser: currentUser,
      });
    } catch (error) {
      console.error("Error logging logout:", error);
    }

    await signOut(auth);
    sessionStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch employees
  useEffect(() => {
    const load = async () => {
      setLoadingEmployees(true);
      setEmployeesError("");
      try {
        const data = await fetchEmployees({
          searchTerm,
          sortField,
          sortDirection,
        });
        setEmployeeData(data);
      } catch (error) {
        console.error("Error:", error);
        setEmployeesError("Failed to load employees. Please try again.");
      } finally {
        setLoadingEmployees(false);
      }
    };

    load();
  }, [searchTerm, sortField, sortDirection]);

  const openProfile = (emp) => {
    setSelectedEmployee(emp);
    setProfileOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeProfile = () => {
    setProfileOpen(false);
    setSelectedEmployee(null);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setAddEmployeeError("");

    const {
      name,
      department,
      position,
      startDate,
      category,
      gender,
      email,
      password,
      role,
    } = newEmployee;

    if (
      !name.trim() ||
      !department.trim() ||
      !position.trim() ||
      !startDate.trim() ||
      !category.trim() ||
      !gender.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setAddEmployeeError(
        "Please fill in all required fields before submitting."
      );
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = cred.user;

      await insertEmployee({
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        full_name: name,
        department,
        position,
        start_date: startDate,
        category,
        gender,
        status: "Active",
        role,
        clockify_user_id: "69399acc2d8d3a36ae5cfa9b",
      });

      await logAudit({
        action: "created_employee",
        details: `Created new employee: ${name} (${position}, ${department})`,
        currentUser: currentUser,
      });

      setNewEmployee({
        name: "",
        department: "",
        position: "",
        startDate: "",
        category: "",
        gender: "",
        email: "",
        password: "",
        role: "user",
      });
      setShowAddForm(false);

      const latest = await fetchEmployees({ searchTerm, sortField, sortDirection });
      setEmployeeData(latest);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setAddEmployeeError(
          "This email is already in use. Please use another email."
        );
      } else {
        console.error(error);
        setAddEmployeeError(
          "Failed to create employee account. Please try again."
        );
      }
    }
  };

  const handleDeleteEmployee = (emp) => {
    setEmployeeToDelete(emp);
    setShowPasswordModal(true);
    setPasswordInput("");
    setPasswordError("");
  };

    const handleConfirmDelete = async (e) => {
      e.preventDefault();
      if (!passwordInput) {
        setPasswordError("Please enter your password");
        return;
      }
      if (!currentUser?.email) {
        setPasswordError("User session not found. Please log in again.");
        return;
      }

      setVerifyingPassword(true);
      setPasswordError("");

      try {
        // re-authenticate admin
        await signInWithEmailAndPassword(
          auth,
          currentUser.email,
          passwordInput
        );

        // soft delete in DB: mark employee Inactive
        await softDeleteEmployeeById(employeeToDelete.id);

        // update UI: flip status instead of removing row
        setEmployeeData((prev) =>
          prev.map((e) =>
            e.id === employeeToDelete.id ? { ...e, status: "Inactive" } : e
          )
        );

        // audit log
        await logAudit({
          action: "deleted_employee",
          details: `Soft-deleted employee: ${employeeToDelete.name}`,
          currentUser,
        });

        // close modal + reset
        setShowPasswordModal(false);
        setEmployeeToDelete(null);
        setPasswordInput("");
        alert(
          `Employee ${employeeToDelete.name} has been marked inactive successfully!`
        );
      } catch (error) {
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/invalid-credential"
        ) {
          setPasswordError("Incorrect password. Please try again.");
        } else {
          console.error(error);
          setPasswordError(
            "Failed to update employee status. Please try again."
          );
        }
      } finally {
        setVerifyingPassword(false);
      }
    };



  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setEmployeeToDelete(null);
    setPasswordInput("");
    setPasswordError("");
  };

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

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans text-gray-800">
      <AdminSidebar
        isOpen={isOpen}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={(path) => navigate(path)}
      />

      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "lg:ml-0" : ""
        }`}
      >
        {/* Header */}
          <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-40">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Left side - Menu button + Title */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
                <button
                  onClick={() => setIsOpen((s) => !s)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors flex-shrink-0"
                  aria-label="Toggle Sidebar"
                >
                  <Menu size={20} className="sm:w-6 sm:h-6" />
                </button>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 tracking-tight truncate leading-tight">
                    Employee Directory
                  </h1>
                  <p className="text-xs text-gray-500 hidden md:block truncate leading-tight">
                    Manage your team members and roles
                  </p>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <span className="hidden xl:inline-block text-xs text-gray-400 font-medium whitespace-nowrap mr-2">
                  Last updated: {currentTime}
                </span>
                <div className="h-5 w-px bg-gray-200 hidden xl:block mr-1" />
                <AdminBell />
                <AdminSetting
                  trigger={
                    <button 
                      className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200 transition-all flex-shrink-0"
                      aria-label="Settings"
                    >
                      <Settings size={18} className="sm:w-5 sm:h-5" />
                    </button>
                  }
                >
                  {({ close }) => <FontSizeMenu closeMenu={close} />}
                </AdminSetting>
              </div>
            </div>
          </header>



        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Stats */}
          <EmployeeStatsCards employees={employeeData} />

          {/* Add drawer */}
          <AddEmployeeDrawer
            open={showAddForm}
            newEmployee={newEmployee}
            onChangeField={handleNewEmployeeChange}
            onSubmit={handleAddEmployee}
            error={addEmployeeError}
            onClose={() => setShowAddForm(false)}
          />

          {/* Table */}
          <EmployeeTable
            employees={employeeData}
            loading={loadingEmployees}
            searchTerm={searchTerm}
            onChangeSearch={setSearchTerm}
            sortDirection={sortDirection}
            onToggleSortDirection={() =>
              setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
            }
            onToggleAddForm={() => setShowAddForm((v) => !v)}
            showAddForm={showAddForm}
            onViewProfile={openProfile}
            onDeleteEmployee={handleDeleteEmployee}
          />

          {employeesError && (
            <p className="text-sm text-red-600">{employeesError}</p>
          )}
        </div>

        <PasswordConfirmModal
          open={showPasswordModal}
          employee={employeeToDelete}
          password={passwordInput}
          error={passwordError}
          verifying={verifyingPassword}
          onChangePassword={setPasswordInput}
          onConfirm={handleConfirmDelete}
          onClose={handleClosePasswordModal}
        />

        <EmployeeProfileModal
          open={profileOpen}
          employee={selectedEmployee}
          onClose={closeProfile}
        />
      </main>
    </div>
  );
}
