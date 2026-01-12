import { useLocation } from "react-router-dom"; // Import useLocation for active state
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
  const location = useLocation(); // Hook to get current path
  const sidebarWidth = isOpen ? "lg:w-64" : "lg:w-20";
  const hideWhenCollapsed = !isOpen && "hidden lg:block";

  return (
    <aside
      className={`h-screen sticky top-0 flex-shrink-0 ${sidebarWidth} bg-green-700 text-white flex flex-col transition-all duration-300 shadow-xl z-30 rounded-r-3xl  overflow-hidden`}
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
        <div className="px-4 w-full space-y-6">
          
          {/* Group 1: Features */}
          <div>
            <h3 className={`text-yellow-300/90 text-[10px] font-bold uppercase tracking-widest mb-3 px-3 ${hideWhenCollapsed}`}>
              Features
            </h3>
            <nav className="space-y-1">
              <NavButton 
                icon={LayoutDashboard} 
                label="Dashboard" 
                path="/dashboard"
                currentPath={location.pathname}
                onClick={() => onNavigate("/dashboard")} 
                isOpen={isOpen}
              />
            </nav>
          </div>

          {/* Group 2: Organization */}
          <div>
            <h3 className={`text-yellow-300/90 text-[10px] font-bold uppercase tracking-widest mb-3 px-3 ${hideWhenCollapsed}`}>
              Organization
            </h3>
            <nav className="space-y-1">
              <NavButton 
                icon={Users} 
                label="Employee Management" 
                path="/employee-management"
                currentPath={location.pathname}
                onClick={() => onNavigate("/employee-management")} 
                isOpen={isOpen}
              />
              <NavButton 
                icon={CalendarDays} 
                label="Leave Management" 
                path="/leave-management"
                currentPath={location.pathname}
                onClick={() => onNavigate("/leave-management")} 
                isOpen={isOpen}
              />
              <NavButton 
                icon={CreditCard} 
                label="Payroll Management" 
                path="/PayrollManagement"
                currentPath={location.pathname}
                onClick={() => onNavigate("/PayrollManagement")} 
                isOpen={isOpen}
              />
              <NavButton 
                icon={Clock} 
                label="Time Tracking" 
                path="/time-tracking"
                currentPath={location.pathname}
                onClick={() => onNavigate("/time-tracking")} 
                isOpen={isOpen}
              />
              <NavButton 
                icon={FileText} 
                label="Audit Logs" 
                path="/audit-logs"
                currentPath={location.pathname}
                onClick={() => onNavigate("/audit-logs")} 
                isOpen={isOpen}
              />
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

// Helper Component for consistent buttons
function NavButton({ icon: Icon, label, path, currentPath, onClick, isOpen }) {
  // Logic to detect active state
  // 1. Exact match (e.g. /dashboard)
  // 2. Sub-path match (e.g. /employee-management/details) 
  // 3. Special case for Dashboard preventing it from being active on every route if you have "/"
  const isActive = currentPath === path || (path !== '/dashboard' && currentPath.startsWith(path));

  // Styles
  const activeClasses = "bg-yellow-400 text-green-900 shadow-md shadow-yellow-400/20 font-bold";
  const inactiveClasses = "text-white/80 hover:bg-green-600 hover:text-white font-medium";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-r-lg cursor-pointer transition-all duration-200 group ${
        isActive ? activeClasses : inactiveClasses
      } ${!isOpen && "justify-center"}`}
    >
      <Icon size={20} className={isActive ? "text-green-900" : "group-hover:scale-110 transition-transform"} />
      {isOpen && <span>{label}</span>}
    </button>
  );
}
