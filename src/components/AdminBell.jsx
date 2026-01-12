import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function AdminBell() {
  const navigate = useNavigate();
  const bellRef = useRef(null);

  const [bellOpen, setBellOpen] = useState(false);
  const [unseenLeavesCount, setUnseenLeavesCount] = useState(0);
  const [unseenLeaves, setUnseenLeaves] = useState([]);
  const [bellSnapshot, setBellSnapshot] = useState([]);

  const fetchBellNotifications = async () => {
    const { count } = await supabase
      .from("leave_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("admin_seen", false);

    setUnseenLeavesCount(count || 0);

    const { data } = await supabase
      .from("leave_applications")
      .select("id, applied_at, employees(full_name, department)")
      .eq("status", "pending")
      .eq("admin_seen", false)
      .order("applied_at", { ascending: false })
      .limit(10);

    setUnseenLeaves(data || []);
  };

  useEffect(() => {
    fetchBellNotifications();

    const interval = setInterval(fetchBellNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // close on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleBellClick = async () => {
    const opening = !bellOpen;

    if (!opening) {
      setBellOpen(false);
      return;
    }

    await fetchBellNotifications();
    setBellSnapshot(unseenLeaves);
    setBellOpen(true);

    // Option A: mark all as seen (do not refetch immediately)
    supabase
      .from("leave_applications")
      .update({
        admin_seen: true,
        admin_seen_at: new Date().toISOString(),
      })
      .eq("status", "pending")
      .eq("admin_seen", false)
      .then(() => {
        setUnseenLeavesCount(0);
      });
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={handleBellClick}
        className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-yellow-400 text-green-900 cursor-pointer hover:bg-yellow-300 transition"
      >
        <Bell size={18} />
        {unseenLeavesCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">
            {unseenLeavesCount}
          </span>
        )}
      </button>

      {bellOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white border border-yellow-200 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-yellow-100">
            <p className="text-sm font-bold text-green-800">
              New Leave Applications
            </p>
            <p className="text-xs text-gray-500">Marked as seen when opened.</p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {bellSnapshot.length === 0 ? (
              <p className="px-4 py-4 text-sm text-gray-500">No new requests.</p>
            ) : (
              bellSnapshot.map((n) => (
                <button
                  key={n.id}
                  onClick={() => navigate("/leave-management")}
                  className="w-full text-left px-4 py-3 hover:bg-yellow-50 transition"
                >
                  <p className="text-sm font-semibold text-green-900">
                    {n.employees?.full_name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {n.employees?.department || "N/A"} •{" "}
                    {n.applied_at
                      ? new Date(n.applied_at).toLocaleString()
                      : ""}
                  </p>
                </button>
              ))
            )}
          </div>

          <div className="px-4 py-3 border-t border-yellow-100">
            <button
              onClick={() => navigate("/leave-management")}
              className="w-full text-sm font-semibold text-green-800 hover:text-green-900"
            >
              Open Leave Management
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
