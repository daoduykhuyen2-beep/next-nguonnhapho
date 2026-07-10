"use client";

import { useActionState } from "react";
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

export default function PasswordForm() {
  const [state, formAction] = useActionState<AccountState, FormData>(changePassword, {});
  return (
    <form action={formAction} className="max-w-md space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Mật khẩu mới</label>
        <input name="password" type="password" required className="w-full rounded-lg border px-4 py-3" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Nhập lại mật khẩu</label>
        <input name="password2" type="password" required className="w-full rounded-lg border px-4 py-3" />
      </div>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-green-600">Đã đổi mật khẩu thành công.</p> : null}
      <Save />
    </form>
  );
}
