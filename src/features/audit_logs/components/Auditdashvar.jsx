import { useLocation } from "react-router-dom"; // Auto-detect active route
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  FileText,
  Clock,
  Power,
} from "lucide-react";

export default function AdminSidebar({
  isOpen,
  currentUser,
  onLogout,
  onNavigate,
}) {
  const location = useLocation(); // Get current URL
  const sidebarWidth = isOpen ? "lg:w-64" : "lg:w-20";
  const hideWhenCollapsed = !isOpen && "hidden lg:block";

  // Navigation Items Config
  const navItems = [
    { label: "Dashboard", path: "/dashboard", Icon: LayoutDashboard, group: "Features" },
    { label: "Employee Management", path: "/employee-management", Icon: Users, group: "Organization" },
    { label: "Leave Management", path: "/leave-management", Icon: CalendarDays, group: "Organization" },
    { label: "Payroll Management", path: "/PayrollManagement", Icon: CreditCard, group: "Organization" },
    { label: "Time Tracking", path: "/time-tracking", Icon: Clock, group: "Organization" },
    { label: "Audit Logs", path: "/audit-logs", Icon: FileText, group: "Organization" },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 flex-shrink-0 ${sidebarWidth} bg-green-700 text-white flex flex-col transition-all duration-300 shadow-xl z-30 rounded-r-3xl overflow-hidden`}
    >
      {/* 1. Scrollable Navigation Area */}
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-green-800">
        
        {/* Profile Section */}
        <div className="flex flex-col items-center pt-10 pb-8 transition-all duration-300">
          <div
            className={`rounded-full bg-yellow-400 flex items-center justify-center shadow-md mb-3 ring-4 ring-green-600/30 transition-all duration-300
            ${isOpen ? "w-20 h-20" : "w-10 h-10"}`}
          >
            <span className={isOpen ? "text-4xl text-green-900" : "text-2xl text-green-900"}>
              👤
            </span>
          </div>

          {isOpen && (
            <>
              <h2 className="text-lg font-bold text-white tracking-wide text-center px-2">
                {currentUser?.fullName || "Admin User"}
              </h2>

              <p className="text-yellow-300 text-xs font-bold uppercase tracking-wider mt-1">
                {currentUser?.position || "System Admin"}
              </p>
            </>
          )}
        </div>


        {/* Navigation Links */}
        <div className="px-4 w-full space-y-6 pb-4">
          
          {/* Group 1: Features */}
          <div>
            <h3 className={`text-yellow-300/90 text-[10px] font-bold uppercase tracking-widest mb-3 px-3 ${hideWhenCollapsed}`}>
              Features
            </h3>
            <nav className="space-y-1">
              {navItems.filter(i => i.group === "Features").map(item => (
                 <NavButton 
                   key={item.path}
                   item={item} 
                   currentPath={location.pathname}
                   onClick={() => onNavigate(item.path)}
                   isOpen={isOpen}
                 />
              ))}
            </nav>
          </div>

          {/* Group 2: Organization */}
          <div>
            <h3 className={`text-yellow-300/90 text-[10px] font-bold uppercase tracking-widest mb-3 px-3 ${hideWhenCollapsed}`}>
              Organization
            </h3>
            <nav className="space-y-1">
              {navItems.filter(i => i.group === "Organization").map(item => (
                 <NavButton 
                   key={item.path}
                   item={item} 
                   currentPath={location.pathname}
                   onClick={() => onNavigate(item.path)}
                   isOpen={isOpen}
                 />
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* 2. Fixed Bottom Section (Logout) */}
      <div className="p-4 bg-green-800/20 border-t border-green-600/30 mt-auto">
        <button
          onClick={onLogout}
          className={`w-full flex items-center justify-center gap-3 rounded-xl bg-green-900/40 hover:bg-green-900 text-white px-4 py-3 text-sm font-bold cursor-pointer transition-all border border-green-600/30 hover:border-yellow-400 group ${!isOpen && "px-0"}`}
        >
          <Power size={20} className="text-yellow-400 group-hover:text-white transition-colors" />
          {isOpen && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}

// Helper Component for consistent active state & styling
function NavButton({ item, currentPath, onClick, isOpen }) {
  const { label, path, Icon } = item;
  
  // Logic to detect active state: exact match or subpath match
  // Special case: /dashboard should only match exact, others can match subpaths
  const isActive = path === "/dashboard" 
    ? currentPath === "/dashboard"
    : currentPath.startsWith(path);

  // Styles
  const activeClasses = "bg-yellow-400 text-green-900 shadow-md shadow-yellow-400/20 font-bold";
  const inactiveClasses = "text-white/80 hover:bg-green-600 hover:text-white font-medium";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${
        isActive ? activeClasses : inactiveClasses
      } ${!isOpen && "justify-center"}`}
    >
      <Icon size={20} className={isActive ? "text-green-900" : "group-hover:scale-110 transition-transform"} />
      {isOpen && <span>{label}</span>}
    </button>
  );
}
