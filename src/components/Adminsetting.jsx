import { useEffect, useRef, useState } from "react";

export default function Dropdown({ trigger, children, align = "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>

      {open && (
        <div className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-2 z-10`}>
          {typeof children === "function"
            ? children({ close: () => setOpen(false) })
            : children}
        </div>
      )}
    </div>
  );
}
