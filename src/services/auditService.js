// src/services/auditService.js
import { supabase } from "../supabaseClient";

export async function fetchAuditLogs({ searchTerm, filterAction, sortDirection }) {
  let query = supabase
    .from("audit_logs")
    .select("*")
    .order("timestamp", { ascending: sortDirection === "asc" });

  if (filterAction !== "all") {
    query = query.eq("action", filterAction);
  }

  if (searchTerm.trim()) {
    const term = searchTerm.trim();
    query = query.or(
      `user_name.ilike.%${term}%,details.ilike.%${term}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
