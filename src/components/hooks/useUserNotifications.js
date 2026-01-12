// src/hooks/useUserNotifications.js
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../supabaseClient";


export function useUserNotifications(employeeId, notifOpen) {
  const [notifications, setNotifications] = useState([]);
  const hasAutoMarkedRef = useRef(false);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read_at).length,
    [notifications]
  );

  // Fetch + realtime subscribe
  useEffect(() => {
    if (!employeeId) return;

    const fetchNotifs = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("employee_id", employeeId)
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) console.error("Fetch notifications error:", error);
      setNotifications(data || []);
    };

    fetchNotifs();

    const channel = supabase
      .channel("notif-" + employeeId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `employee_id=eq.${employeeId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [employeeId]);

  // Mark all read (function you can call from UI)
  const markAllRead = async () => {
    if (!employeeId) return;
    const now = new Date().toISOString();

    const { error } = await supabase
      .from("notifications")
      .update({ read_at: now })
      .eq("employee_id", employeeId)
      .is("read_at", null);

    if (error) {
      console.error("Mark all read error:", error);
      return;
    }

    setNotifications((prev) =>
      prev.map((n) => (n.read_at ? n : { ...n, read_at: now }))
    );
  };

  // Auto mark read when dropdown opens (once per open)
  useEffect(() => {
    if (!notifOpen) {
      hasAutoMarkedRef.current = false;
      return;
    }
    if (!employeeId) return;
    if (hasAutoMarkedRef.current) return;

    const hasUnread = notifications.some((n) => !n.read_at);
    if (!hasUnread) return;

    hasAutoMarkedRef.current = true;
    markAllRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifOpen, employeeId, notifications]);

  return { notifications, unreadCount, markAllRead, setNotifications };
}
