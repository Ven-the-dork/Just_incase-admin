import { useEffect, useId, useState } from "react";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const rid = useId();

  const buttonId = `faq-q-${rid}`;
  const panelId = `faq-a-${rid}`;

  return (
    <div className="border border-yellow-200 rounded-xl overflow-hidden">
      <button
        id={buttonId}
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-white hover:bg-yellow-50"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-bold text-green-900">{q}</span>
        <span className="text-green-800">{open ? "−" : "+"}</span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={open ? "px-4 pb-4 text-sm text-gray-700" : "hidden"}
      >
        {a}
      </div>
    </div>
  );
}

export default function FAQModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const items = [
    {
      q: "How do I clock in?",
      a: "Navigate to the Attendance page and click 'Clock In'. Note: Clock-in is only allowed before 12:00 PM. Any clock-in at or after 9:00 AM will be marked as 'Late'.",
    },
    {
      q: "How do I apply for leave?",
      a: "Click 'Apply for Leave' on your dashboard, select the leave type, choose dates, and submit your request. Your manager will review and approve it.",
    },
    {
      q: "How can I check my leave balance?",
      a: "Your remaining leave days are shown on the Apply for Leave page and on your dashboard widget. Each leave type displays available days.",
    },
    {
      q: "What happens if my leave request is rejected?",
      a: "You'll see the status change to 'Rejected' in your Leave History. You can reapply with different dates or contact your manager for clarification.",
    },
    {
      q: "Can I cancel a leave request?",
      a: "If your leave is still pending approval, contact your manager or admin to cancel it. Approved leaves may require special approval to recall.",
    },
    {
      q: "How do I update my profile information?",
      a: "Click 'Update Profile' on your dashboard or the User icon. You can change your name, contact, address, and upload a profile picture. Email cannot be changed.",
    },
    {
      q: "Where can I view my payroll history?",
      a: "Go to the Payroll History tab at the top of your dashboard to see past payments and download payslips.",
    },
    {
      q: "What should I do if my attendance is incorrect?",
      a: "Contact your manager or HR administrator immediately with the correct details. They can review and adjust attendance records if needed.",
    },
    {
      q: "How do I change my password?",
      a: "Navigate to the Login page and click 'Forgot Password'. Enter your registered email address to receive a password reset link. Please check both your inbox and spam folder for the email.",
    },
    {
      q: "Who can I contact for technical support?",
      a: "For technical issues or questions, contact your HR department or system administrator via email or the support channel provided by your organization.",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-title"
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-yellow-100">
          <div>
            <p id="faq-title" className="text-sm font-bold text-green-800">
              FAQ
            </p>
            <p className="text-xs text-gray-500">Common questions</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Close
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto">
  {items.map((it, i) => (
    <FAQItem key={i} q={it.q} a={it.a} />
  ))}
</div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-yellow-100 bg-yellow-50/50 text-xs text-gray-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-1">
            <p className="font-semibold text-green-800">Contact</p>
            <p>
            Email:{" "}
            <a className="text-green-700 hover:underline" >
               reavenmiano58@gmail.com
            </a>
            </p>
            <p>
            Phone:{" "}
            <a className="text-green-700 hover:underline" >
                +63 961 260 3451
            </a>
            </p>
        </div>

        <div className="text-gray-500 sm:text-right">
            © {new Date().getFullYear()}   CVSU. All rights reserved.
        </div>
        </div>
      </div>
    </div>
  );
}
