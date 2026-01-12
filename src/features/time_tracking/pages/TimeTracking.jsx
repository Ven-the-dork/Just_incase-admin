// src/pages/admin/timetracking/TimeTracking.jsx
import { useState, useEffect } from "react";
import {
  Menu,
  Settings,
  CalendarDays,
  Filter as FilterIcon,
  CheckCircle,
  AlertTriangle,
  UserX,
  DollarSign,
  Ban,
  Palmtree,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { supabase } from "../../../supabaseClient";

import AdminBell from "../../../components/AdminBell";
import AdminSidebar from "../components/Timetrackdashvar";
import FontSizeMenu from "../../../components/hooks/FontSizeMenu";
import AdminSetting from "../../../components/Adminsetting";

import StatCard from "../components/StatCard";
import TimeTrackingFilters from "../components/TimeTrackingFilters";
import TimeTrackingTable from "../components/TimeTrackingTable";

export default function TimeTracking() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [stats, setStats] = useState({
    present: 0,
    late: 0,
    absent: 0,
    onPaidLeave: 0,
    onUnpaidLeave: 0,
    weekend: 0,
  });

  const TZ = "Asia/Singapore";
  const LATE_HOUR = 9;

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem("user");
    navigate("/", { replace: true });
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

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const { data: employees, error: empError } = await supabase
          .from("employees")
          .select("id, full_name, department, role, is_disabled")
          
          .eq("is_disabled", false)
          .neq("role", "admin");

        if (empError) throw empError;

        const { data: logs, error: logError } = await supabase
          .from("attendance_logs")
          .select("employee_id, clock_in_at, shift_date, notes")
          .eq("shift_date", selectedDate);
        if (logError) throw logError;

        const { data: leaves, error: leaveError } = await supabase
          .from("leave_applications")
          .select(`
            employee_id, 
            start_date, 
            end_date, 
            status,
            leave_plans!inner(is_paid)
          `)
          .eq("status", "approved")
          .lte("start_date", selectedDate)
          .gte("end_date", selectedDate);
        if (leaveError) throw leaveError;

        // Check if selected date is weekend (Sunday only)
        const dateToCheck = new Date(selectedDate + "T00:00:00");
        const dayOfWeek = dateToCheck.getDay();
        const isWeekend = dayOfWeek === 0;

        let presentCount = 0;
        let lateCount = 0;
        let absentCount = 0;
        let onPaidLeaveCount = 0;
        let onUnpaidLeaveCount = 0;
        let weekendCount = 0;

        const merged = employees.map((emp) => {
          const leave = leaves.find((l) => l.employee_id === emp.id);
          const log = logs.find((l) => l.employee_id === emp.id);

          let status = "Absent";
          let clockIn = "-";

          // Check weekend FIRST
          if (isWeekend) {
            status = "Weekend";
            clockIn = "Weekend";
            weekendCount++;
            return {
              id: emp.id,
              employee: emp.full_name ?? "(No name)",
              department: emp.department ?? "-",
              date: selectedDate,
              clockIn,
              status,
            };
          }

          // Check clock-in FIRST (before leave)
          if (log?.clock_in_at) {
            const start = new Date(log.clock_in_at);
            clockIn = start.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: TZ,
            });

            const startHour = parseInt(
              start.toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: false,
                timeZone: TZ,
              }),
              10
            );
            const startMin = parseInt(
              start.toLocaleTimeString("en-US", {
                minute: "2-digit",
                hour12: false,
                timeZone: TZ,
              }),
              10
            );
            const isLate =
              startHour > LATE_HOUR ||
              (startHour === LATE_HOUR && startMin > 0);

            status = isLate ? "Late" : "Present";
            if (isLate) lateCount++;
            else presentCount++;
          } else if (leave) {
            // No clock-in, but has approved leave
            const isPaid = leave.leave_plans?.is_paid ?? true;
            status = isPaid ? "On Paid Leave" : "On Unpaid Leave";
            clockIn = isPaid ? "Paid Leave" : "Unpaid Leave";

            if (isPaid) {
              onPaidLeaveCount++;
            } else {
              onUnpaidLeaveCount++;
            }
          } else {
            // No clock-in, no leave
            status = "Absent";
            absentCount++;
          }

          return {
            id: emp.id,
            employee: emp.full_name ?? "(No name)",
            department: emp.department ?? "-",
            date: selectedDate,
            clockIn,
            status,
          };
        });

        setAttendanceData(merged);
        setStats({
          present: presentCount,
          late: lateCount,
          absent: absentCount,
          onPaidLeave: onPaidLeaveCount,
          onUnpaidLeave: onUnpaidLeaveCount,
          weekend: weekendCount,
        });
      } catch (error) {
        console.error("ATTENDANCE_FETCH_ERROR", error);
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [selectedDate]);

  const filteredData = attendanceData.filter((row) => {
    if (selectedDepartment !== "All" && row.department !== selectedDepartment)
      return false;
    if (selectedStatus !== "All" && row.status !== selectedStatus) return false;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      if (
        !row.employee.toLowerCase().includes(lower) &&
        !row.department.toLowerCase().includes(lower)
      )
        return false;
    }
    return true;
  });

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
        <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                Time Tracking
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Daily attendance monitoring
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
              <FontSizeMenu />
            </AdminSetting>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <StatCard
              icon={CheckCircle}
              color="green"
              value={stats.present}
              label="Present"
            />
            <StatCard
              icon={AlertTriangle}
              color="yellow"
              value={stats.late}
              label="Late"
            />
            <StatCard
              icon={DollarSign}
              color="blue"
              value={stats.onPaidLeave}
              label="Paid Leave"
            />
            <StatCard
              icon={Ban}
              color="orange"
              value={stats.onUnpaidLeave}
              label="Unpaid Leave"
            />
            <StatCard
              icon={Palmtree}
              color="teal"
              value={stats.weekend}
              label="Weekend"
            />
            <StatCard
              icon={UserX}
              color="red"
              value={stats.absent}
              label="Absent"
            />
          </div>

          <TimeTrackingFilters
            selectedDate={selectedDate}
            onChangeDate={setSelectedDate}
            selectedDepartment={selectedDepartment}
            onChangeDepartment={setSelectedDepartment}
            selectedStatus={selectedStatus}
            onChangeStatus={setSelectedStatus}
            searchTerm={searchTerm}
            onChangeSearch={setSearchTerm}
          />

          <TimeTrackingTable loading={loading} rows={filteredData} />
        </div>
      </main>
    </div>
  );
}
