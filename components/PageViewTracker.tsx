"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Moi khi doi trang (mo trang moi), ghi 1 luot truy cap.
// Chi ghi 1 lan cho moi duong dan trong 1 phien de tranh dem lap khi re-render.
export default function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) return;
    // Bo qua trang quan tri de khong tu lam phong so lieu.
    if (pathname.startsWith("/admin")) return;
    try {
      const key = "__pv_" + pathname;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    fetch("/api/track-view", { method: "POST", keepalive: true }).catch(() => {});
  }, [pathname]);
  return null;
}
