import { supabase } from "../supabaseClient";

/**
 * Log an audit event to the database
 * @param {Object} params - Audit log parameters
 * @param {string} params.action - Action performed (e.g., "admin_login", "accessed_payroll", "deleted_employee")
 * @param {string} params.details - Additional details about the action
 * @param {Object} params.currentUser - Current user object from session storage
 */
export async function logAudit({ action, details, currentUser }) {
  try {
    const { error } = await supabase.from("audit_logs").insert({
      user_id: currentUser?.employeeId || null,
      firebase_uid: currentUser?.uid || null,
      user_name: currentUser?.fullName || "Unknown",
      user_email: currentUser?.email || "Unknown",
      action: action,
      details: details || "",
      user_agent: navigator.userAgent || null,
    });

    if (error) {
      console.error("Error logging audit:", error);
    }
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}

/**
 * Fetch audit logs (admin only)
 * @param {number} limit - Number of logs to fetch (default: 100)
 * @returns {Promise<Array>} Array of audit log entries
 */
export async function getAuditLogs(limit = 100) {
  try {
    const { data, error } = await supabase
      .from("audit_logs_with_employee")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    return [];
  }
}
