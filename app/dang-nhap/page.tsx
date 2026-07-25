"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DangNhapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/tai-khoan";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("remember_me");
    if (saved !== null) setRemember(saved === "1");

    if (searchParams.get("verified") === "1") {
      setNotice("Xác nhận email thành công! Mời bạn đăng nhập.");
    }
    const err = searchParams.get("error");
    if (err === "auth") {
      setError("Liên kết xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
    }
  }, [searchParams]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Luu lua chon ghi nho TRUOC khi tao client (client doc gia tri nay)
    localStorage.setItem("remember_me", remember ? "1" : "0");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("confirm")) {
        setError(
          "Tài khoản chưa được xác nhận. Vui lòng kiểm tra email để xác nhận trước khi đăng nhập."
        );
      } else {
        setError("Email hoặc mật khẩu không đúng.");
      }
      return;
    }

    router.push(nextUrl);
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Đăng nhập</h1>

      {notice && <p className="text-green-600 mb-4">{notice}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            placeholder="ban@example.com"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Mật khẩu</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded px-3 py-2 pr-14"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-red-600"
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Ghi nhớ tài khoản</span>
          </label>
          <Link href="/quen-mat-khau" className="text-red-600 text-sm">
            Quên mật khẩu?
          </Link>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white rounded py-2 font-semibold disabled:opacity-60"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        Chưa có tài khoản?{" "}
        <Link href="/dang-ky" className="text-red-600">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
