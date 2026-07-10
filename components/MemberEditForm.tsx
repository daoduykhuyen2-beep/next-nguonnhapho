"use client";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { adminUpdateMember, type AdminState } from "@/app/actions/admin";

type M = { id: string; full_name: string | null; email: string | null; phone: string | null; membership_tier: string | null; is_admin: boolean | null };

function Save() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "..." : "Lưu"}</button>;
}

export default function MemberEditForm({ member }: { member: M }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<AdminState, FormData>(adminUpdateMember, {});
  if (!open) {
    return (<button onClick={() => setOpen(true)} className="rounded-lg border px-3 py-1 text-sm font-semibold hover:border-brand hover:text-brand">Sửa</button>);
  }
  return (
    <form action={formAction} className="mt-2 space-y-2 rounded-lg bg-gray-50 p-3">
      <input type="hidden" name="id" value={member.id} />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input name="full_name" defaultValue={member.full_name || ""} placeholder="Họ tên" className="rounded border px-3 py-2 text-sm" />
        <input name="phone" defaultValue={member.phone || ""} placeholder="SĐT" className="rounded border px-3 py-2 text-sm" />
        <select name="membership_tier" defaultValue={member.membership_tier || "free"} className="rounded border px-3 py-2 text-sm">
          <option value="free">Miễn phí</option>
          <option value="BASIC">Cơ bản</option>
          <option value="PRO">Chuyên nghiệp</option>
          <option value="VIP">VIP</option>
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_admin" defaultChecked={!!member.is_admin} /> Quản trị viên</label>
      </div>
      {state?.error ? <p className="text-xs text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-xs text-green-600">Đã lưu.</p> : null}
      <div className="flex gap-2"><Save /><button type="button" onClick={() => setOpen(false)} className="rounded-lg border px-4 py-2 text-sm">Đóng</button></div>
    </form>
  );
}
