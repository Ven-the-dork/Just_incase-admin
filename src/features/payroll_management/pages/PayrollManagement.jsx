// src/pages/admin/payroll/PayrollManagement.jsx
import { useState, useEffect, useMemo } from "react";
import { Menu, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

import AdminBell from "../../../components/AdminBell";
import AdminSidebar from "../components/Payrolldashvar";
import FontSizeMenu from "../../../components/hooks/FontSizeMenu";
import AdminSetting from "../../../components/Adminsetting";

import {
  fetchActiveEmployeesForPayroll,
  updateEmployeeDailyRate,
  upsertPayrollRun,
  upsertPayrollRecords,
  calculateEmployeePayroll, // ✅ NEW: Import new function
} from "../../../services/payrollService";

import PayrollConfigCard from "../components/PayrollConfigCard";
import PayrollStatsCards from "../components/PayrollStatsCards";
import PayrollTable from "../components/PayrollTable";

export default function PayrollManagement() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-01-31");

  const [employees, setEmployees] = useState([]);
  const [payrollCalculations, setPayrollCalculations] = useState({}); // ✅ NEW: Store detailed calculations
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingPayroll, setLoadingPayroll] = useState(false); // ✅ NEW: Renamed from loadingAttendance

  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [savingRateById, setSavingRateById] = useState({});
  const [rateErrorById, setRateErrorById] = useState({});

  const [processing, setProcessing] = useState(false);
  const [processMsg, setProcessMsg] = useState("");

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

  const peso = (n) =>
    Number.isFinite(n)
      ? n.toLocaleString("en-PH", { style: "currency", currency: "PHP" })
      : "₱0.00";

  const setSavingFor = (id, val) =>
    setSavingRateById((prev) => ({ ...prev, [id]: val }));
  const setRateErrorFor = (id, msg) =>
    setRateErrorById((prev) => ({ ...prev, [id]: msg }));

  // 1) Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const data = await fetchActiveEmployeesForPayroll();
        setEmployees(data);
      } catch (error) {
        console.error("Load employees error:", error);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };
    loadEmployees();
  }, []);

  // 2) ✅ NEW: Calculate payroll with paid/unpaid leaves
  useEffect(() => {
    const calculatePayrolls = async () => {
      if (!startDate || !endDate || employees.length === 0) return;

      setLoadingPayroll(true);
      try {
        const calculations = {};

        for (const emp of employees) {
          const result = await calculateEmployeePayroll(
            emp.id,
            startDate,
            endDate
          );

          if (result.success) {
            calculations[emp.id] = result;
          }
        }

        setPayrollCalculations(calculations);
      } catch (error) {
        console.error("Calculate payroll error:", error);
        setPayrollCalculations({});
      } finally {
        setLoadingPayroll(false);
      }
    };

    calculatePayrolls();
  }, [startDate, endDate, employees]);

  const filteredEmployees = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) => {
      const name = (e.full_name || "").toLowerCase();
      const dept = (e.department || "").toLowerCase();
      const pos = (e.position || "").toLowerCase();
      return name.includes(q) || dept.includes(q) || pos.includes(q);
    });
  }, [employees, searchTerm]);

  const toggleRow = (employeeId) => {
    setSelectedEmployeeIds((prev) =>
      prev.includes(employeeId)
        ? prev.filter((x) => x !== employeeId)
        : [...prev, employeeId]
    );
  };

  const visibleIds = filteredEmployees.map((e) => e.id);
  const allVisibleSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) => selectedEmployeeIds.includes(id));

  const toggleAll = () => {
    if (allVisibleSelected) {
      setSelectedEmployeeIds((prev) =>
        prev.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelectedEmployeeIds((prev) =>
        Array.from(new Set([...prev, ...visibleIds]))
      );
    }
  };

  const handleRateChange = (employeeId, value) => {
    setRateErrorFor(employeeId, "");
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, daily_rate: value } : e))
    );
  };

  const saveRate = async (employeeId) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return;

    const rateNum = Number(emp.daily_rate);
    if (!Number.isFinite(rateNum) || rateNum < 0) {
      setRateErrorFor(employeeId, "Invalid rate");
      return;
    }

    setSavingFor(employeeId, true);
    setRateErrorFor(employeeId, "");

    try {
      await updateEmployeeDailyRate(employeeId, rateNum);
      // ✅ Recalculate payroll after rate change
      const result = await calculateEmployeePayroll(
        employeeId,
        startDate,
        endDate
      );
      if (result.success) {
        setPayrollCalculations((prev) => ({
          ...prev,
          [employeeId]: result,
        }));
      }
    } catch (err) {
      setRateErrorFor(employeeId, err?.message || "Failed to save");
    } finally {
      setSavingFor(employeeId, false);
    }
  };

  // ✅ NEW: Build rows with detailed payroll data
  const rowsWithPreview = useMemo(() => {
    return filteredEmployees.map((e) => {
      const calculation = payrollCalculations[e.id];

      if (!calculation || !calculation.success) {
        return {
          ...e,
          workedDays: 0,
          paidLeaveDays: 0,
          payableDays: 0,
          grossPay: 0,
        };
      }

      return {
        ...e,
        workedDays: calculation.attendance.workedDays,
        paidLeaveDays: calculation.attendance.paidLeaveDays,
        unpaidLeaveDays: calculation.attendance.unpaidLeaveDays,
        absentDays: calculation.attendance.absentDays,
        payableDays: calculation.attendance.payableDays,
        grossPay: calculation.payment.grossPay,
      };
    });
  }, [filteredEmployees, payrollCalculations]);

  const totalGross = useMemo(
    () =>
      rowsWithPreview
        .filter((r) => selectedEmployeeIds.includes(r.id))
        .reduce((sum, r) => sum + (Number(r.grossPay) || 0), 0),
    [rowsWithPreview, selectedEmployeeIds]
  );

  const handleProcessPayroll = async () => {
    if (processing) return;
    setProcessMsg("");

    if (!startDate || !endDate)
      return setProcessMsg("Please select dates.");
    if (selectedEmployeeIds.length === 0)
      return setProcessMsg("Select at least 1 employee.");

    setProcessing(true);
    try {
      const runId = await upsertPayrollRun(startDate, endDate);

      const records = rowsWithPreview
        .filter((r) => selectedEmployeeIds.includes(r.id))
        .map((r) => ({
          employee_id: r.id,
          period_start: startDate,
          period_end: endDate,
          gross_pay: Number(r.grossPay) || 0,
          deductions: 0,
          status: "Paid",
          paid_at: new Date().toISOString(),
        }));

      await upsertPayrollRecords(records);

      setProcessMsg(`✅ Success! Processed ${records.length} employees. Run ID: ${runId ?? "N/A"}`);
      setSelectedEmployeeIds([]);
    } catch (err) {
      console.error(err);
      setProcessMsg(`❌ ${err?.message || "Failed to process payroll."}`);
    } finally {
      setProcessing(false);
    }
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
                Payroll Management
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Process employee payroll with attendance tracking
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
          {/* Stats Cards */}
          <PayrollStatsCards
            selectedCount={selectedEmployeeIds.length}
            totalGross={totalGross}
            peso={peso}
          />

          {/* Config Card */}
          <PayrollConfigCard
            startDate={startDate}
            endDate={endDate}
            onChangeStart={setStartDate}
            onChangeEnd={setEndDate}
            loadingAttendance={loadingPayroll}
            processMsg={processMsg}
          />

          {/* Payroll Table */}
          <PayrollTable
            searchTerm={searchTerm}
            onChangeSearch={setSearchTerm}
            loadingEmployees={loadingEmployees}
            rowsWithPreview={rowsWithPreview}
            selectedEmployeeIds={selectedEmployeeIds}
            onToggleRow={toggleRow}
            onToggleAll={toggleAll}
            allVisibleSelected={allVisibleSelected}
            rateErrorById={rateErrorById}
            onRateChange={handleRateChange}
            onSaveRate={saveRate}
            peso={peso}
          />

          {/* Process Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <button
              onClick={handleProcessPayroll}
              disabled={processing || selectedEmployeeIds.length === 0}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {processing
                ? "Processing..."
                : `Process Payroll (${selectedEmployeeIds.length} selected)`}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
