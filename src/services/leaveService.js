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

// User: leave usage for balance calculations (DashboardUser)
export async function fetchUserLeaveApplications(firebaseUid) {
  const { data, error } = await supabase
    .from("leave_applications")
    .select("leave_plan_id, duration_days, status")
    .eq("firebase_uid", firebaseUid)
    .in("status", ["approved", "pending"]);

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
       leave_plans (name, allow_recall, is_paid)`
    )
    .eq("status", "approved")
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
