// src/features/audit_logs/hooks/useAuditLogs.js
import { useEffect, useState } from "react";
import { fetchAuditLogs } from "../../../services/auditService";

export function useAuditLogs() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAuditLogs({ searchTerm, filterAction, sortDirection });
        setAuditLogs(data);
      } catch (err) {
        console.error("Error fetching audit logs:", err);
        setError("Failed to load audit logs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [searchTerm, filterAction, sortDirection]);

  return {
    auditLogs,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterAction,
    setFilterAction,
    sortDirection,
    setSortDirection,
  };
}
