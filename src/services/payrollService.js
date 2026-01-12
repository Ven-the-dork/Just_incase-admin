// src/services/payrollService.js
import { supabase } from "../supabaseClient";

// ========================================
// EXISTING FUNCTIONS (Keep as-is)
// ========================================

// Admin: list active employees for payroll processing
export async function fetchActiveEmployeesForPayroll() {
  const { data, error } = await supabase
    .from("employees")
    .select("id, full_name, department, position, daily_rate, profile_image_url") 
    .eq("is_disabled", false)
    .neq("role", "admin");
  if (error) throw error;
  return data || [];
}

// Admin: attendance summary per employee for a period
export async function fetchAttendanceCounts(startDate, endDate) {
  const { data, error } = await supabase
    .from("attendance_logs")
    .select("employee_id, shift_date")
    .gte("shift_date", startDate)
    .lte("shift_date", endDate)
    .not("clock_in_at", "is", null);

  if (error) throw error;

  const counts = {};
  for (const row of data || []) {
    const key = row.employee_id;
    const day = row.shift_date;
    if (!counts[key]) counts[key] = new Set();
    counts[key].add(day);
  }

  const normalized = {};
  Object.keys(counts).forEach((k) => {
    normalized[k] = counts[k].size;
  });
  return normalized;
}

// Admin: update daily rate inline in payroll screen
export async function updateEmployeeDailyRate(employeeId, rateNum) {
  const { error } = await supabase
    .from("employees")
    .update({ daily_rate: rateNum })
    .eq("id", employeeId);

  if (error) throw error;
}

// Admin: create or reuse a payroll run id for a period
export async function upsertPayrollRun(startDate, endDate) {
  const { data: insertedRun, error: runInsertErr } = await supabase
    .from("payroll_runs")
    .insert([{ period_start: startDate, period_end: endDate }])
    .select("id")
    .maybeSingle();

  if (!runInsertErr && insertedRun?.id) return insertedRun.id;

  // if insert failed (likely duplicate), try to find existing
  const { data: existingRun } = await supabase
    .from("payroll_runs")
    .select("id")
    .eq("period_start", startDate)
    .eq("period_end", endDate)
    .maybeSingle();

  return existingRun?.id ?? null;
}

// Admin: upsert payroll records per employee
export async function upsertPayrollRecords(records) {
  const { error } = await supabase
    .from("payroll_records")
    .upsert(records, { onConflict: "employee_id,period_start,period_end" });

  if (error) throw error;
}

// User dashboard: fetch payroll history for a single employee
export async function fetchPayrollHistoryByEmployee(employeeId, limit = 24) {
  const { data, error } = await supabase
    .from("payroll_records")
    .select("*")
    .eq("employee_id", employeeId)
    .order("period_end", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// ========================================
// NEW FUNCTIONS (Time Tracking Integration)
// ========================================

/**
 * Calculate detailed payroll for an employee with paid/unpaid leave tracking
 * Counts: Worked Days (Present + Late) + Paid Leave Days
 * Excludes: Absent, Unpaid Leave, Weekends (Sundays)
 */
export async function calculateEmployeePayroll(employeeId, startDate, endDate) {
  try {
    // 1. Get employee data
    const { data: employee, error: empError } = await supabase
      .from("employees")
      .select("id, full_name, daily_rate")
      .eq("id", employeeId)
      .single();

    if (empError) throw empError;
    if (!employee.daily_rate) {
      throw new Error("Employee has no daily rate set");
    }

    // 2. Get attendance logs (clock-ins: Present + Late both count)
    const { data: attendance, error: attError } = await supabase
      .from("attendance_logs")
      .select("shift_date, clock_in_at")
      .eq("employee_id", employeeId)
      .gte("shift_date", startDate)
      .lte("shift_date", endDate)
      .not("clock_in_at", "is", null);

    if (attError) throw attError;

    // 3. Get paid leaves (approved, is_paid = true)
    const { data: paidLeaves, error: paidLeaveError } = await supabase
      .from("leave_applications")
      .select(`
        start_date,
        end_date,
        leave_plans!inner(is_paid)
      `)
      .eq("employee_id", employeeId)
      .eq("status", "approved")
      .eq("leave_plans.is_paid", true)
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

    if (paidLeaveError) throw paidLeaveError;

    // 4. Get unpaid leaves (for reporting only)
    const { data: unpaidLeaves, error: unpaidLeaveError } = await supabase
      .from("leave_applications")
      .select(`
        start_date,
        end_date,
        leave_plans!inner(is_paid)
      `)
      .eq("employee_id", employeeId)
      .eq("status", "approved")
      .eq("leave_plans.is_paid", false)
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

    if (unpaidLeaveError) throw unpaidLeaveError;

    // 5. Calculate working days in period (exclude Sundays)
    const start = new Date(startDate);
    const end = new Date(endDate);
    let totalWorkingDays = 0;
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0) {
        // Not Sunday
        totalWorkingDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 6. Count worked days (all clock-ins, late or on-time)
    const workedDates = new Set();
    attendance.forEach((log) => {
      const logDate = new Date(log.shift_date);
      const dayOfWeek = logDate.getDay();
      if (dayOfWeek !== 0) {
        // Not Sunday
        workedDates.add(log.shift_date);
      }
    });
    const workedDays = workedDates.size;

    // 7. Count paid leave days (exclude weekends and already worked days)
    const paidLeaveDates = new Set();
    (paidLeaves || []).forEach((leave) => {
      let leaveStart = new Date(leave.start_date);
      let leaveEnd = new Date(leave.end_date);

      // Clamp to payroll period
      if (leaveStart < start) leaveStart = start;
      if (leaveEnd > end) leaveEnd = end;

      let currentLeaveDate = new Date(leaveStart);
      while (currentLeaveDate <= leaveEnd) {
        const dateStr = currentLeaveDate.toISOString().split("T")[0];
        const dayOfWeek = currentLeaveDate.getDay();

        // Count if: not Sunday, not already worked
        if (dayOfWeek !== 0 && !workedDates.has(dateStr)) {
          paidLeaveDates.add(dateStr);
        }

        currentLeaveDate.setDate(currentLeaveDate.getDate() + 1);
      }
    });
    const paidLeaveDays = paidLeaveDates.size;

    // 8. Count unpaid leave days (for reporting)
    const unpaidLeaveDates = new Set();
    (unpaidLeaves || []).forEach((leave) => {
      let leaveStart = new Date(leave.start_date);
      let leaveEnd = new Date(leave.end_date);

      if (leaveStart < start) leaveStart = start;
      if (leaveEnd > end) leaveEnd = end;

      let currentLeaveDate = new Date(leaveStart);
      while (currentLeaveDate <= leaveEnd) {
        const dateStr = currentLeaveDate.toISOString().split("T")[0];
        const dayOfWeek = currentLeaveDate.getDay();

        if (dayOfWeek !== 0 && !workedDates.has(dateStr)) {
          unpaidLeaveDates.add(dateStr);
        }

        currentLeaveDate.setDate(currentLeaveDate.getDate() + 1);
      }
    });
    const unpaidLeaveDays = unpaidLeaveDates.size;

    // 9. Calculate payable days
    const payableDays = workedDays + paidLeaveDays;

    // 10. Calculate gross pay
    const grossPay = payableDays * employee.daily_rate;

    // 11. Calculate absent days
    const absentDays = totalWorkingDays - workedDays - paidLeaveDays - unpaidLeaveDays;

    return {
      success: true,
      employee: {
        id: employee.id,
        name: employee.full_name,
        dailyRate: employee.daily_rate,
      },
      period: {
        start: startDate,
        end: endDate,
        totalWorkingDays,
      },
      attendance: {
        workedDays, // Present + Late (both count)
        paidLeaveDays, // Paid leave days
        unpaidLeaveDays, // Unpaid leave days (not paid)
        absentDays, // Days not worked, no leave
        payableDays, // Total days to pay
      },
      payment: {
        grossPay: Math.round(grossPay * 100) / 100,
        deductions: 0,
        netPay: Math.round(grossPay * 100) / 100,
      },
    };
  } catch (error) {
    console.error("CALCULATE_PAYROLL_ERROR:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Calculate payroll for all active employees
 */
export async function calculatePayrollForAll(startDate, endDate) {
  try {
    const employees = await fetchActiveEmployeesForPayroll();
    const results = [];

    for (const emp of employees) {
      const calculation = await calculateEmployeePayroll(emp.id, startDate, endDate);
      if (calculation.success) {
        results.push({
          employee: emp,
          calculation,
        });
      }
    }

    return { success: true, data: results };
  } catch (error) {
    console.error("CALCULATE_ALL_PAYROLL_ERROR:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Save calculated payroll to database
 */
export async function saveCalculatedPayroll(employeeId, startDate, endDate, grossPay, deductions = 0) {
  try {
    const record = {
      employee_id: employeeId,
      period_start: startDate,
      period_end: endDate,
      gross_pay: grossPay,
      deductions: deductions,
      status: "Pending",
    };

    await upsertPayrollRecords([record]);

    return { success: true };
  } catch (error) {
    console.error("SAVE_PAYROLL_ERROR:", error);
    return { success: false, error: error.message };
  }
}
