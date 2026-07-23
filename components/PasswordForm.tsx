"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { changePassword, type AccountState } from "@/app/actions/account";

function Save() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60">
      {pending ? "Đang cập nhật..." : "Đổi mật khẩu"}
    </button>
  );
}

function PasswordInput({ name, label }: { name: string; label: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          required
          className="w-full rounded-lg border px-4 py-3 pr-12"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-500 hover:text-gray-700"
        >
          {show ? "Ẩn" : "Hiện"}
        </button>
      </div>
    </div>
  );
}

export default function PasswordForm() {
  const [state, formAction] = useActionState<AccountState, FormData>(changePassword, {});
  return (
    <form action={formAction} className="max-w-md space-y-5">
      <PasswordInput name="password" label="Mật khẩu mới" />
        <p className="mt-1 text-xs text-gray-500">Tối thiểu 8 ký tự, gồm cả chữ và số.</p>
      <PasswordInput name="password2" label="Nhập lại mật khẩu" />
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-green-600">Đã đổi mật khẩu thành công.</p> : null}
      <Save />
    </form>
  );
}
