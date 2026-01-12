// src/services/timeTrackingService.js
import { supabase } from "../supabaseClient";

export async function fetchActiveEmployees() {
  const { data, error } = await supabase
    .from("employees")
    .select("id, full_name, department, role, status, is_disabled") // add is_disabled
    .eq("is_disabled", false)
    .neq("role", "admin");

  if (error) throw error;
  return data || [];
}



export async function fetchAttendanceLogsByDate(date) {
  const { data, error } = await supabase
    .from("attendance_logs")
    .select("employee_id, clock_in_at, shift_date, notes")
    .eq("shift_date", date);

  if (error) throw error;
  return data || [];
}

export async function fetchApprovedLeavesForDate(date) {
  const { data, error } = await supabase
    .from("leave_applications")
    .select("employee_id, start_date, end_date, status")
    .eq("status", "approved")
    .lte("start_date", date)
    .gte("end_date", date);

  if (error) throw error;
  return data || [];
}
