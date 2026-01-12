// src/components/UserTopBar.jsx
import { Bell, Settings, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FontSizeMenu from "./hooks/FontSizeMenu";

export default function UserTopBar({
  notifOpen,
  setNotifOpen,
  unreadCount,
  notifications,
  onMarkAllRead,
  onLogout,
  onOpenProfileModal,
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const notifRef = useRef(null);
  const settingsRef = useRef(null);

  // close on outside + ESC
  useEffect(() => {
    const onDown = (e) => {
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (settingsOpen && settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };

    const onKey = (e) => {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [notifOpen, settingsOpen, setNotifOpen]);

  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          type="button"
          onClick={() => setNotifOpen((v) => !v)}
          className="h-10 w-10 inline-flex items-center justify-center rounded-lg hover:bg-yellow-50 text-green-600 hover:text-yellow-500 transition relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 mt-2 w-80 rounded-xl border border-yellow-100 bg-white shadow-lg overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-yellow-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-green-800">Notifications</p>
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-xs text-green-700 hover:underline"
              >
                Mark all read
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-500">No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-yellow-50 ${
                      n.read_at ? "bg-white" : "bg-yellow-50/60"
                    }`}
                  >
                    <p className="text-sm font-semibold text-green-900">{n.title}</p>
                    {n.message && (
                      <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                    )}
                    <p className="text-[11px] text-gray-400 mt-1">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="relative" ref={settingsRef}>
        <button
          type="button"
          onClick={() => setSettingsOpen((v) => !v)}
          className="h-10 w-10 inline-flex items-center justify-center rounded-lg hover:bg-yellow-50 text-green-600 hover:text-yellow-500 transition"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>

        {settingsOpen && (
          <div className="absolute right-0 mt-2 w-72 rounded-xl border border-yellow-100 bg-white shadow-lg overflow-hidden z-50">
            <div className="p-3">
              <FontSizeMenu closeMenu={() => setSettingsOpen(false)} />
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={onLogout}
        className="h-10 w-10 inline-flex items-center justify-center rounded-lg hover:bg-red-50 text-green-600 hover:text-red-500 transition"
        aria-label="Logout"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  );
}
