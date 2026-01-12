import { useEffect, useState } from "react";

export default function useFontScale() {
  const [scale, setScale] = useState(() => {
    const saved = localStorage.getItem("app_font_scale");
    const num = saved ? Number(saved) : 1;
    return Number.isFinite(num) ? num : 1;
  });

  useEffect(() => {
    localStorage.setItem("app_font_scale", String(scale));
    document.documentElement.style.setProperty("--app-font-scale", String(scale));
  }, [scale]);

  return [scale, setScale];
}
