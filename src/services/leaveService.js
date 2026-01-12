// src/services/leaveService.js
import { supabase } from "../supabaseClient";

// Admin: list active leave plans (settings + select options)
export async function fetchLeavePlans() {
  const { data, error } = await supabase
    .from("leave_plans")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;
  return data || [];
}

// User: fetch leave plans filtered by employee category
export async function fetchLeavePlansForCategory(employeeCategory) {
  const { data, error } = await supabase
    .from("leave_plans")
    .select("*")
    .eq("is_active", true)
    .order("name");
  
  if (error) throw error;
  
  // Filter based on category
  if (employeeCategory === "Job Order") {
    // Only return unpaid leave types for Job Order employees
    return (data || []).filter(plan => plan.is_paid === false);
  }
  
  // Regular employees get all leave types (paid and unpaid)
  return data || [];
}

// ✅ UPDATED: User: leave usage for balance calculations (includes recalled leaves)
export async function fetchUserLeaveApplications(firebaseUid) {
  const { data, error } = await supabase
    .from("leave_applications")
    .select("leave_plan_id, duration_days, status, days_used") // ✅ Added days_used
    .eq("firebase_uid", firebaseUid)
    .in("status", ["approved", "pending", "recalled"]); // ✅ Added recalled

  if (error) throw error;
  return data || [];
}

// ✅ UPDATED: Admin: recall view - only currently active & recallable leaves
export async function fetchOngoingRecallableLeaves(todayIso) {
  const { data, error } = await supabase
    .from("leave_applications")
    .select(
      `*,
       employees (full_name, department),
       leave_plans (name, allow_recall, is_paid)` // ✅ Added is_paid
    )
    .eq("status", "approved")
    .lte("start_date", todayIso)
    .gte("end_date", todayIso)
    .order("start_date", { ascending: false });

  if (error) throw error;
  const rows = data || [];
  return rows.filter((leave) => leave.leave_plans?.allow_recall === true);
}

// Admin: create / manage leave plans
export async function createLeavePlan(payload) {
  const { data, error } = await supabase
    .from("leave_plans")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateLeavePlan(id, updates) {
  const { error } = await supabase
    .from("leave_plans")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function softDeleteLeavePlan(id) {
  const { error } = await supabase
    .from("leave_plans")
    .update({ is_active: false })
    .eq("id", id);

  if (error) throw error;
}

// Admin actions: approve / reject / recall
export async function updateLeaveStatus(id, updates) {
  const { error } = await supabase
    .from("leave_applications")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

// ✅ UPDATED: For notifications after action
export async function getLeaveApplicationForNotification(id) {
  const { data, error } = await supabase
    .from("leave_applications")
    .select(
      `id, employee_id, start_date, end_date, reason,
       leave_plans (name, is_paid),
       employees (full_name)`
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function insertNotification(payload) {
  const { error } = await supabase.from("notifications").insert(payload);
  if (error) throw error;
}

// ✅ UPDATED: Admin: list all leave applications with employee + plan info for history tab
export async function fetchAdminLeaveApplications() {
  const { data, error } = await supabase
    .from("leave_applications")
    .select(
      `*,
       employees (full_name, department),
       leave_plans (name, is_paid)`
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// ✅ UPDATED: User: full history list for Apply Leave page
export async function fetchUserLeaveHistory(firebaseUid) {
  const { data, error } = await supabase
    .from("leave_applications")
    .select(`*, leave_plans (name, is_paid)`)
    .eq("firebase_uid", firebaseUid)
    .order("applied_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// User: create a new leave application
export async function insertLeaveApplication(payload) {
  const { data, error } = await supabase
    .from("leave_applications")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

// ========================================
// ✅ NEW FUNCTIONS FOR RECALL FEATURE
// ========================================

/**
 * Calculate working days between two dates (exclude Sundays only)
 */
function calculateWorkingDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end < start) return 0;

  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0) count++; // Exclude Sunday only
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * Recall a leave and refund unused days
 */
export async function recallLeaveWithRefund(
  leaveApplicationId,
  newResumptionDate,
  recallReason,
  reviewedBy
) {
  try {
    // 1. Get the leave application details
    const { data: leaveApp, error: fetchError } = await supabase
      .from("leave_applications")
      .select(`
        *,
        employees!inner(id, full_name),
        leave_plans!inner(id, name, duration_days)
      `)
      .eq("id", leaveApplicationId)
      .single();

    if (fetchError) throw fetchError;

    const startDate = leaveApp.start_date;
    const endDate = leaveApp.end_date;
    const employeeId = leaveApp.employee_id;
    const leavePlanId = leaveApp.leave_plan_id;

    // 2. Calculate days used and days to refund
    const resumeDate = new Date(newResumptionDate);
    const lastLeaveDate = new Date(resumeDate);
    lastLeaveDate.setDate(lastLeaveDate.getDate() - 1);
    const lastLeaveDateStr = lastLeaveDate.toISOString().split('T')[0];

    // Days used (start to day before resumption)
    const daysUsed = calculateWorkingDays(startDate, lastLeaveDateStr);
    
    // Days to refund (resumption date to original end date)
    const daysToRefund = calculateWorkingDays(newResumptionDate, endDate);

    console.log("📊 Recall Calculation:", {
      originalPeriod: `${startDate} to ${endDate}`,
      newResumptionDate,
      daysUsed,
      daysToRefund
    });

    // 3. Update leave application status
    const { error: updateError } = await supabase
      .from("leave_applications")
      .update({
        status: "recalled",
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewedBy,
        recall_date: newResumptionDate,
        recall_reason: recallReason,
        days_used: daysUsed,
        days_refunded: daysToRefund
      })
      .eq("id", leaveApplicationId);

    if (updateError) throw updateError;

    // 4. Refund unused days to employee's leave balance
    if (daysToRefund > 0) {
      const { data: currentBalance, error: balanceError } = await supabase
        .from("leave_balances")
        .select("remaining_days")
        .eq("employee_id", employeeId)
        .eq("leave_plan_id", leavePlanId)
        .single();

      if (balanceError) {
        console.warn("No leave balance found, skipping refund");
      } else {
        const newBalance = currentBalance.remaining_days + daysToRefund;

        const { error: refundError } = await supabase
          .from("leave_balances")
          .update({ remaining_days: newBalance })
          .eq("employee_id", employeeId)
          .eq("leave_plan_id", leavePlanId);

        if (refundError) throw refundError;

        console.log(`✅ Refunded ${daysToRefund} days to employee ${employeeId}`);
      }
    }

    // 5. Send notification to employee
    await insertNotification({
      employee_id: employeeId,
      type: "leave_recalled",
      title: "Leave Recalled",
      message: `Your leave has been recalled. You are expected to return on ${newResumptionDate}. ${daysToRefund} days have been refunded to your balance.`,
      is_read: false,
    });

    return {
      success: true,
      daysUsed,
      daysToRefund,
      message: `Leave recalled. ${daysUsed} days used, ${daysToRefund} days refunded.`
    };

  } catch (error) {
    console.error("RECALL_WITH_REFUND_ERROR:", error);
    throw error;
  }
}
