"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/Toast";

export default function DangKyPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const mismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (
      password.length < 8 ||
      !/[A-Za-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      setError("Mật khẩu phải từ 8 ký tự trở lên và gồm cả chữ và số.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dang-nhap`,
        data: { full_name: fullName, phone },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      setError("Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.");
      return;
    }

    setDone(true);
    showToast("Đã gửi email xác nhận. Vui lòng kiểm tra hộp thư của bạn.", "success");
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Kiểm tra email của bạn</h1>
        <p className="text-gray-600">
          Chúng tôi đã gửi email xác nhận tới <strong>{email}</strong>. Vui lòng mở
          email và bấm vào liên kết xác nhận để kích hoạt tài khoản, sau đó quay lại
          đăng nhập.
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Không thấy email? Hãy kiểm tra mục Spam / Quảng cáo.
        </p>
        <Link
          href="/dang-nhap"
          className="inline-block mt-6 text-red-600 font-semibold"
        >
          Về trang đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Đăng ký tài khoản</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block mb-1">Họ và tên</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Số điện thoại</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Mật khẩu</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Tối thiểu 8 ký tự, gồm chữ và số"
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
        <div>
          <label className="block mb-1">Xác nhận mật khẩu</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              className="w-full border rounded px-3 py-2 pr-14"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2 text-red-600"
            >
              {showConfirm ? "Ẩn" : "Hiện"}
            </button>
          </div>
          {mismatch && (
            <p className="text-red-600 text-sm mt-1">Mật khẩu xác nhận không khớp.</p>
          )}
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white rounded py-2 font-semibold disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        Đã có tài khoản? <Link href="/dang-nhap" className="text-red-600">Đăng nhập</Link>
      </p>
    </div>
  );
}
