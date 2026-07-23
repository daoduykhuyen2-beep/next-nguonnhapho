"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Thoi gian cho (giay) truoc khi cho phep gui lai email.
const RESEND_COOLDOWN = 60;

export default function QuenMatKhauPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Dem nguoc thoi gian cho gui lai.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function sendResetEmail() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const redirectTo =
      typeof window !== "undefined"
        ? window.location.origin + "/dat-lai-mat-khau"
        : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });

    setLoading(false);
    if (error) {
      // Khong tiet lo email co ton tai hay khong, chi bao loi chung than thien.
      setError(
        "Không thể gửi email lúc này. Vui lòng kiểm tra lại địa chỉ email và thử lại sau."
      );
      return;
    }
    setSent(true);
    setCooldown(RESEND_COOLDOWN);
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    await sendResetEmail();
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-md rounded-xl border bg-white p-6 text-center">
        <h1 className="mb-2 text-xl font-bold">Đã gửi email!</h1>
        <p className="text-gray-600">
          Vui lòng kiểm tra hộp thư của bạn và nhấn vào liên kết để đặt lại mật
          khẩu. Nếu không thấy, hãy kiểm tra mục spam.
        </p>
        <button
          type="button"
          disabled={cooldown > 0 || loading}
          onClick={sendResetEmail}
          className="mt-4 inline-block rounded-lg border border-brand px-5 py-2 font-semibold text-brand disabled:opacity-60"
        >
          {cooldown > 0
            ? `Gửi lại sau ${cooldown}s`
            : loading
            ? "Đang gửi..."
            : "Gửi lại email"}
        </button>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <div className="mt-4">
          <Link
            href="/dang-nhap"
            className="inline-block rounded-lg bg-brand px-5 py-2 font-semibold text-white"
          >
            Về trang đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-bold">Quên mật khẩu</h1>
      <p className="mb-6 text-sm text-gray-600">
        Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết để bạn đặt lại mật khẩu.
      </p>
      <form
        onSubmit={handleReset}
        className="space-y-4 rounded-xl border bg-white p-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="ban@example.com"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        <Link href="/dang-nhap" className="font-semibold text-brand">
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}
