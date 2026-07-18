"use client";

import { useState } from "react";

const PHONE = "0987645314";

export default function FloatingContact() {
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3">
      {/* Nút gọi điện */}
      <a
        href={`tel:${PHONE}`}
        aria-label="Gọi hỗ trợ trực tiếp"
        className="group flex items-center gap-2"
      >
        <span className="hidden sm:block whitespace-nowrap rounded-full bg-white px-3 py-1 text-sm font-semibold text-green-600 shadow-md ring-1 ring-black/5 opacity-0 translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
          Hỗ trợ trực tiếp: {PHONE}
        </span>
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg ring-4 ring-green-500/20 transition-transform hover:scale-105">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="relative h-7 w-7">
            <path d="M6.62 10.79a15.53 15.53 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3.5a1 1 0 011-1H7.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
          </svg>
        </span>
      </a>

      {/* Nút Zalo */}
      <a
        href={`https://zalo.me/${PHONE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        className="group flex items-center gap-2"
      >
        <span className="hidden sm:block whitespace-nowrap rounded-full bg-white px-3 py-1 text-sm font-semibold text-blue-600 shadow-md ring-1 ring-black/5 opacity-0 translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
          Chat Zalo
        </span>
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0068FF] text-white shadow-lg ring-4 ring-[#0068FF]/20 transition-transform hover:scale-105">
          <span className="text-base font-extrabold tracking-tight">Zalo</span>
        </span>
      </a>
    </div>
  );
}
