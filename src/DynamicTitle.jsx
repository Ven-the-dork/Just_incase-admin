import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function DynamicTitle() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "Employee Management System";

    switch (path) {
        case "/time-tracking":
        title = "Time-Tracking | EMS";
        break;
        case "/profile":
        title = "Profile | EMS";
        break;
        case "/audit-logs":
        title = "Audit-Logs | EMS";
        break;
      case "/admin-login":
        title = "Admin-Login | EMS";
        break;
      case "/PayrollManagement":
        title = "Payroll Management | EMS";
        break;
      case "/applyforleave":
        title = "Apply-for-Leave | EMS";
        break;
      case "/dashboard":
        title = "Dashboard-admin | EMS";
        break;
      case "/employee-management":
        title = "Employee Management | EMS";
        break;
      case "/leave-management":
        title = "Leave Management | EMS";
        break;
      case "/":
         title = "Admin-Login | EMS";
        break;
      case "/dashboard_user":
        title = "Dashboard | EMS";
        break;
      default:
        title = "Employee Management System";
        break;
    }

    document.title = title;
  }, [location]);

  return null;
}
