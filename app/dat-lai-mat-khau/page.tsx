"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  // "checking" -> dang kiem tra phien; "valid" -> co the doi mat khau; "invalid" -> link het han
  const [status, setStatus] = useState<"checking" | "valid" | "invalid">(
    "checking"
  );

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  // Kiem tra nguoi dung co dang trong phien dat lai mat khau hop le hay khong.
  useEffect(() => {
    const supabase = createClient();

    // Supabase phat su kien PASSWORD_RECOVERY khi mo link tu email.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setStatus("valid");
      }
    });

    // Truong hop session da duoc thiet lap truoc do (vd qua auth callback).
    supabase.auth.getSession().then(({ data }) => {
      setStatus((prev) =>
        prev === "valid" ? prev : data.session ? "valid" : "invalid"
      );
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
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
      setError(
        "Mật khẩu phải từ 8 ký tự trở lên và gồm cả chữ và số."
      );
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError(
        "Không thể đổi mật khẩu. Liên kết có thể đã hết hạn, vui lòng yêu cầu gửi lại."
      );
      return;
    }
    setDone(true);
  }

  if (status === "checking") {
    return (
      <div className="mx-auto max-w-md rounded-xl border bg-white p-6 text-center">
        <p className="text-gray-600">Đang kiểm tra liên kết...</p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="mx-auto max-w-md rounded-xl border bg-white p-6 text-center">
        <h1 className="mb-2 text-xl font-bold">Liên kết không hợp lệ</h1>
        <p className="text-gray-600">
          Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu gửi lại email đặt lại mật khẩu.
        </p>
        <Link
          href="/quen-mat-khau"
          className="mt-4 inline-block rounded-lg bg-brand px-5 py-2 font-semibold text-white"
        >
          Yêu cầu liên kết mới
        </Link>
      </div>
    );
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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 pr-16"
              placeholder="Ít nhất 8 ký tự, gồm chữ và số"
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
          {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
}
