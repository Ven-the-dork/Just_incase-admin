import { useState } from "react";
import { clockifyClockIn } from "../../../utils/clockifyClient";

export default function AttendancePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClockIn = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await clockifyClockIn();
      setMessage(res?.message || "Clock-in recorded.");
    } catch (e) {
      const msg = e && typeof e === "object" && "message" in e ? e.message : "Something went wrong.";
      setMessage(msg);
      console.error("Attendance error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleClockIn}
        disabled={loading}
        className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white px-4 py-2 rounded-md font-semibold"
      >
        {loading ? "Processing..." : "Clock in"}
      </button>

      {message ? <p className="mt-3 text-sm">{message}</p> : null}
    </div>
  );
}
