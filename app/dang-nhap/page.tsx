"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DangNhapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/tai-khoan";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);
    if (error) {
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }
    router.push(nextUrl);
    router.refresh();
  }

  async function handleGoogleLogin() {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          nextUrl
        )}`,
      },
    });
    if (error) {
      setError("Không thể đăng nhập bằng Google. Vui lòng thử lại.");
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Đăng nhập</h1>
      <form
        onSubmit={handleLogin}
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
        <div>
          <label className="mb-1 block text-sm font-medium">Mật khẩu</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 pr-16"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-brand"
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
          <div className="mt-1 text-right">
            <Link
              href="/quen-mat-khau"
              className="text-sm font-semibold text-brand"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="relative py-2 text-center">
          <span className="relative z-10 bg-white px-3 text-xs text-gray-400">
            hoặc
          </span>
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3 14.7 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c5.9 0 9.8-4.1 9.8-9.9 0-.7-.1-1.2-.2-1.7H12z" />
          </svg>
          Đăng nhập bằng Google
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Chưa có tài khoản?{" "}
        <Link href="/dang-ky" className="font-semibold text-brand">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
