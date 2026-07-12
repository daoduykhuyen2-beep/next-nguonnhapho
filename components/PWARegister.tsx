"use client";

import { useEffect, useState } from "react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PWARegister() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Đăng ký service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }

    // Bắt sự kiện cài đặt app
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const onInstalled = () => {
      setInstalled(true);
      setShow(false);
      setDeferred(null);
    };
    window.addEventListener("appinstalled", onInstalled);

    // Nếu đã chạy dạng app (standalone) thì ẩn nút
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    if (standalone) setInstalled(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") {
      setShow(false);
      setDeferred(null);
    }
  };

  if (installed || !show || !deferred) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[70] w-[92%] max-w-md -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="App" className="h-10 w-10 rounded-lg" />
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-900">
            Cài đặt ứng dụng Nhà Phố HCM
          </div>
          <div className="text-xs text-gray-500">
            Truy cập nhanh, chạy toàn màn hình như app.
          </div>
        </div>
        <button
          onClick={() => setShow(false)}
          className="rounded-md px-2 py-1 text-sm text-gray-400 hover:bg-gray-100"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>
      <button
        onClick={install}
        className="mt-2 w-full rounded-lg bg-[#c8102e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a50d26]"
      >
        Cài đặt ngay
      </button>
    </div>
  );
}
