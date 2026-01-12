// src/features/dashboard/pages/DashboardAdmin.jsx
import { Menu, Settings } from "lucide-react";
import AdminBell from "../../../components/AdminBell";
import AdminSidebar from "../components/Dashsidevar";
import FontSizeMenu from "../../../components/hooks/FontSizeMenu";
import AdminSetting from "../../../components/Adminsetting";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import AdminOverviewCards from "../components/AdminOverviewCards";
import AdminQuickActions from "../components/AdminQuickActions";

export default function DashboardAdmin() {
  const {
    isOpen,
    setIsOpen,
    currentUser,
    employeeCount,
    pendingLeavesCount,
    loadingCounts,
    handleLogout,
    currentTime,
    navigate,
  } = useAdminDashboard();

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
        <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen((s) => !s)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              type="button"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Welcome back, {currentUser?.fullName || "Admin"}
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
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200 transition-all"
                  aria-label="Settings"
                >
                  <Settings size={20} />
                </button>
              }
            >
              {({ close }) => <FontSizeMenu closeMenu={close} />}
            </AdminSetting>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          <AdminOverviewCards
            employeeCount={employeeCount}
            pendingLeavesCount={pendingLeavesCount}
            loadingCounts={loadingCounts}
          />
          <AdminQuickActions
            pendingLeavesCount={pendingLeavesCount}
            navigate={navigate}
          />
        </div>
      </main>
    </div>
  );
}
