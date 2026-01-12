// src/services/dashboardService.js
import { supabase } from "../supabaseClient";

export async function fetchDashboardStats() {
  const result = {
    employeeCount: 0,
    pendingLeavesCount: 0,
  };

  // Count only enabled employees (is_disabled = false, excluding admins)
  const { count: empCount, error: empError } = await supabase
    .from("employees")
    .select("*", { count: "exact", head: true })
    .neq("role", "admin")
    .eq("is_disabled", false); // Only count enabled employees

  if (!empError) {
    result.employeeCount = empCount || 0;
  }

  const { count: leaveCount, error: leaveError } = await supabase
    .from("leave_applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  if (!leaveError) {
    result.pendingLeavesCount = leaveCount || 0;
  }

  return result;
}
