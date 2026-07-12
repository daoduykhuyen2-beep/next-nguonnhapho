"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DatLaiMatKhauPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu tối thiểu 6 ký tự.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md rounded-xl border bg-white p-6 text-center">
        <h1 className="mb-2 text-xl font-bold">Đổi mật khẩu thành công!</h1>
        <p className="text-gray-600">
          Bạn có thể dùng mật khẩu mới để đăng nhập.
        </p>
        <button
          onClick={() => {
            router.push("/tai-khoan");
            router.refresh();
          }}
          className="mt-4 inline-block rounded-lg bg-brand px-5 py-2 font-semibold text-white"
        >
          Vào tài khoản
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-bold">Đặt lại mật khẩu</h1>
      <p className="mb-6 text-sm text-gray-600">
        Nhập mật khẩu mới cho tài khoản của bạn.
      </p>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border bg-white p-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 pr-16"
              placeholder="Tối thiểu 6 ký tự"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-brand"
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={
                "w-full rounded-md border px-3 py-2 pr-16 " +
                (mismatch ? "border-red-500" : "")
              }
              placeholder="Nhập lại mật khẩu mới"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-brand"
            >
              {showConfirm ? "Ẩn" : "Hiện"}
            </button>
          </div>
          {mismatch ? (
            <p className="mt-1 text-sm text-red-600">
              Mật khẩu xác nhận không khớp.
            </p>
          ) : null}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading || mismatch}
          className="w-full rounded-lg bg-brand px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Đang lưu..." : "Cập nhật mật khẩu"}
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
