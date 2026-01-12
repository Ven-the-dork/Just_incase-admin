// src/features/audit_logs/pages/AuditLogs.jsx
import { useEffect, useState } from "react";
import { Menu, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import AdminBell from "../../../components/AdminBell";
import AdminSidebar from "../components/Auditdashvar";
import FontSizeMenu from "../../../components/hooks/FontSizeMenu";
import AdminSetting from "../../../components/Adminsetting";

import { useAuditLogs } from "../hooks/useAuditLogs";
import AuditLogsFilterBar from "../components/AuditLogsFilterBar";
import AuditLogsTable from "../components/AuditLogsTable";

export default function AuditLogs() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const {
    auditLogs,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterAction,
    setFilterAction,
    sortDirection,
    setSortDirection,
  } = useAuditLogs();

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) return;
    try {
      setCurrentUser(JSON.parse(stored));
    } catch {
      setCurrentUser(null);
    }
  }, []);

  const exportToCSV = () => {
    const headers = ["Timestamp", "Action", "Performed By", "Details"];
    const rows = auditLogs.map((log) => [
      new Date(log.timestamp).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      log.action,
      log.user_name || "System",
      log.details,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit_logs_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

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
        activePath="/audit-logs"
      />

      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "lg:ml-0" : ""
        }`}
      >
        <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen((s) => !s)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                Audit Logs
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                System activity and security trail
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
          <AuditLogsFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterAction={filterAction}
            setFilterAction={setFilterAction}
            sortDirection={sortDirection}
            toggleSortDirection={() =>
              setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
            }
            onExport={exportToCSV}
          />

          <AuditLogsTable
            auditLogs={auditLogs}
            loading={loading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
}
