// src/pages/admin/timetracking/components/StatCard.jsx
export default function StatCard({ icon: Icon, color, value, label }) {
  const colorStyles = {
    green: "bg-green-500 text-white shadow-green-200",
    yellow: "bg-yellow-500 text-white shadow-yellow-200",
    blue: "bg-blue-500 text-white shadow-blue-200",
    orange: "bg-orange-500 text-white shadow-orange-200",
    teal: "bg-teal-500 text-white shadow-teal-200", // ✅ NEW
    purple: "bg-purple-500 text-white shadow-purple-200",
    red: "bg-red-500 text-white shadow-red-200",
  };

  const bgStyles = {
    green: "bg-gradient-to-br from-green-400 to-green-600",
    yellow: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    blue: "bg-gradient-to-br from-blue-400 to-blue-600",
    orange: "bg-gradient-to-br from-orange-400 to-orange-600",
    teal: "bg-gradient-to-br from-teal-400 to-teal-600", // ✅ NEW
    purple: "bg-gradient-to-br from-purple-400 to-purple-600",
    red: "bg-gradient-to-br from-red-400 to-red-600",
  };

  return (
    <div
      className={`${bgStyles[color]} rounded-xl shadow-lg p-6 text-white transition-transform hover:scale-105`}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon size={32} className="opacity-90" />
      </div>
      <div className="text-4xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium opacity-90 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
