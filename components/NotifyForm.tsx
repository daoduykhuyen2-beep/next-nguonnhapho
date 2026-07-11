"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminSendNotification, type AdminState } from "@/app/actions/admin";

function Save() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="rounded-lg bg-brand px-6 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Đang gửi..." : "Gửi thông báo"}</button>;
}

export default function NotifyForm() {
  const [state, formAction] = useActionState<AdminState, FormData>(adminSendNotification, {});
  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Tiêu đề</label>
        <input name="tieu_de" required className="w-full rounded-lg border px-4 py-3" placeholder="Ví dụ: Khuyến mãi tháng 7 - giảm 50% gói PRO" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Nội dung</label>
        <textarea name="noi_dung" rows={4} className="w-full rounded-lg border px-4 py-3" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Loại</label>
        <select name="loai" className="rounded-lg border px-4 py-3">
          <option value="thong_bao">Thông báo</option>
          <option value="khuyen_mai">Khuyến mãi</option>
        </select>
      </div>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-green-600">Đã gửi thông báo tới mọi người.</p> : null}
      <Save />
    </form>
  );
}
