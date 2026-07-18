"use client";

import { useEffect, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

// Hàm tiện ích gọi từ bất kỳ client component nào: showToast("Đã lưu!", "success")
export function showToast(message: string, type: ToastType = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("app:toast", { detail: { message, type } })
  );
}

const STYLES: Record<ToastType, { bg: string; icon: string }> = {
  success: { bg: "bg-emerald-600", icon: "✓" },
  error: { bg: "bg-red-600", icon: "✕" },
  info: { bg: "bg-slate-800", icon: "ℹ" },
};

export default function Toast() {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent).detail as {
        message: string;
        type?: ToastType;
      };
      if (!detail || !detail.message) return;
      const id = Date.now() + Math.random();
      const item: ToastItem = {
        id,
        message: detail.message,
        type: detail.type || "success",
      };
      setItems((prev) => [...prev, item]);
      setTimeout(() => remove(id), 3500);
    }
    window.addEventListener("app:toast", onToast as EventListener);
    return () =>
      window.removeEventListener("app:toast", onToast as EventListener);
  }, [remove]);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2 px-3">
      {items.map((t) => {
        const s = STYLES[t.type];
        return (
          <div
            key={t.id}
            role="status"
            onClick={() => remove(t.id)}
            className={`pointer-events-auto flex max-w-sm cursor-pointer items-center gap-2 rounded-lg ${s.bg} px-4 py-3 text-sm font-medium text-white shadow-lg ring-1 ring-black/10 animate-in`}
            style={{ animation: "toastIn 0.25s ease-out" }}
          >
            <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white/25 text-xs font-bold">
              {s.icon}
            </span>
            <span>{t.message}</span>
          </div>
        );
      })}
      <style>{`@keyframes toastIn { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
