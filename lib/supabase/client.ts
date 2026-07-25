"use client";

import { createBrowserClient } from "@supabase/ssr";

// Doc lua chon "ghi nho tai khoan" da luu o trang dang nhap
function getMaxAge(): number | undefined {
  if (typeof window === "undefined") return undefined;
  const remember = localStorage.getItem("remember_me") === "1";
  // Nho: 30 ngay. Khong nho: undefined => cookie phien (mat khi dong trinh duyet)
  return remember ? 60 * 60 * 24 * 30 : undefined;
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        maxAge: getMaxAge(),
        path: "/",
        sameSite: "lax",
        secure:
          typeof window !== "undefined" &&
          window.location.protocol === "https:",
      },
    }
  );
}
