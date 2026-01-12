import { supabase } from "../supabaseClient";

export async function hasAttendanceToday(employeeId, shiftDate) {
  const { data, error } = await supabase
    .from("attendance_logs")
    .select("id")
    .eq("employee_id", employeeId)
    .eq("shift_date", shiftDate)
    .limit(1);

  if (error) throw error;
  return (data?.length ?? 0) > 0;
}
