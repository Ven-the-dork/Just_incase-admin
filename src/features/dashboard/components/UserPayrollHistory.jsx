// src/features/dashboard/components/UserPayrollHistory.jsx
import { useState, useEffect, useMemo } from "react";
import { Calendar, Receipt, Eye, X } from "lucide-react";
import { fetchPayrollHistoryByEmployee } from "../../../services/payrollService";

export default function UserPayrollHistory({ employeeId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [viewingPayslip, setViewingPayslip] = useState(null);

  const peso = (n) =>
    Number.isFinite(n)
      ? Number(n).toLocaleString("en-PH", {
          style: "currency",
          currency: "PHP",
        })
      : "₱0.00";

  const formatDate = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString("en-PH");
    } catch {
      return "—";
    }
  };

  const formatPeriod = (start, end) => {
    if (!start && !end) return "—";
    if (start && end) return `${start} to ${end}`;
    return start || end;
  };

  useEffect(() => {
    const loadPayroll = async () => {
      if (!employeeId) return;

      setLoading(true);
      setErrMsg("");

      try {
        const data = await fetchPayrollHistoryByEmployee(employeeId, 24);
        setRows(data);
      } catch (error) {
        console.error("Load payroll_records error:", error);
        setErrMsg(error.message || "Failed to load payroll history.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    loadPayroll();
  }, [employeeId]);

  const stats = useMemo(() => {
    const amounts = (rows || []).map((r) => Number(r.gross_pay) || 0);
    const total = amounts.reduce((a, b) => a + b, 0);
    const avg = amounts.length ? total / amounts.length : 0;
    const highest = amounts.length ? Math.max(...amounts) : 0;
    const lowest = amounts.length ? Math.min(...amounts) : 0;
    return { total, avg, highest, lowest };
  }, [rows]);

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Payroll History
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-yellow-100 text-yellow-800">
            {rows.length} Records
          </span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          View your payment records and payslip details
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Paid */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <span className="text-2xl">₱</span>
              </div>
              <div className="p-1.5 bg-white/20 rounded-md">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium opacity-90">Total Paid</p>
              <p className="text-2xl font-extrabold tracking-tight">
                {peso(stats.total)}
              </p>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Average Pay */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 p-6 text-white shadow-lg">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="px-2 py-0.5 bg-white/20 rounded-md text-xs font-bold">
                AVG
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium opacity-90">Average Pay</p>
              <p className="text-2xl font-extrabold tracking-tight">
                {peso(stats.avg)}
              </p>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Highest Pay */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-green-500 p-6 text-white shadow-lg">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </div>
              <div className="px-2 py-0.5 bg-white/20 rounded-md text-xs font-bold">
                HIGH
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium opacity-90">Highest Pay</p>
              <p className="text-2xl font-extrabold tracking-tight">
                {peso(stats.highest)}
              </p>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Lowest Pay */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
              <div className="px-2 py-0.5 bg-white/20 rounded-md text-xs font-bold">
                LOW
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium opacity-90">Lowest Pay</p>
              <p className="text-2xl font-extrabold tracking-tight">
                {peso(stats.lowest)}
              </p>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100">
        {errMsg && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-100">
            <p className="text-sm text-red-600 font-medium">{errMsg}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-green-600 mb-3" />
              <p>Loading payroll records...</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      Period
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Receipt size={14} />
                      Total Earnings
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <div className="p-4 bg-gray-50 rounded-full">
                          <Receipt size={32} className="text-gray-300" />
                        </div>
                        <p className="font-medium">No payroll records found</p>
                        <p className="text-xs">
                          Your payment history will appear here
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((r, idx) => (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {formatPeriod(r.period_start, r.period_end)}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                              <Calendar size={12} />
                              Paid: {formatDate(r.paid_at)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-green-700 text-base">
                          {peso(Number(r.gross_pay) || 0)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 ring-1 ring-green-600/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                          {r.status || "Paid"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewingPayslip(r)}
                            className="p-2 text-gray-400 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors group/btn"
                            title="View Details"
                          >
                            <Eye
                              size={18}
                              className="group-hover/btn:scale-110 transition-transform"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {viewingPayslip && (
        <PayslipViewModal
          record={viewingPayslip}
          onClose={() => setViewingPayslip(null)}
          peso={peso}
          period={formatPeriod(
            viewingPayslip.period_start,
            viewingPayslip.period_end
          )}
        />
      )}
    </section>
  );
}

function PayslipViewModal({ record, onClose, peso, period }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        <div className="bg-green-900 px-6 py-5 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">Payslip Details</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition rounded-full hover:bg-white/10 p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Pay Period
            </p>
            <p className="text-gray-900 font-extrabold text-xl">{period}</p>
          </div>

          <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Gross Pay</span>
              <span className="font-bold text-gray-900">
                {peso(record.gross_pay)}
              </span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span className="font-medium">Deductions</span>
              <span>- {peso(record.deductions)}</span>
            </div>
            <div className="h-px bg-gray-200 my-1" />
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-green-900">Net Pay</span>
              <span className="font-extrabold text-green-700">
                {peso(record.net_pay)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full text-sm font-bold text-gray-600 hover:text-gray-900 py-2 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
