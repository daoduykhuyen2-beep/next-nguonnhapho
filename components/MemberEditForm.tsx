"use client";
import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { adminUpdateMember, adminDeleteUser, adminSetPassword, type AdminState } from "@/app/actions/admin";

type M = { id: string; full_name: string | null; email: string | null; phone: string | null; membership_tier: string | null; is_admin: boolean | null };

function Save() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "..." : "Luu"}</button>;
}

export default function MemberEditForm({ member }: { member: M }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<AdminState, FormData>(adminUpdateMember, {});
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState("");

  function handleDelete() {
    const yes = window.confirm(`Xoa vinh vien tai khoan ${member.email || member.full_name || member.id}? Hanh dong nay khong the hoan tac.`);
    if (!yes) return;
    setErr(null); setMsg(null);
    startTransition(async () => {
      const r = await adminDeleteUser(member.id);
      if (r?.error) setErr(r.error);
      else setMsg("Da xoa tai khoan.");
    });
  }

  function handleSetPw() {
    setErr(null); setMsg(null);
    startTransition(async () => {
      const r = await adminSetPassword(member.id, pw);
      if (r?.error) setErr(r.error);
      else { setMsg("Da dat lai mat khau."); setPw(""); setPwOpen(false); }
    });
  }

  if (!open) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setOpen(true)} className="rounded-lg border px-3 py-1 text-sm font-semibold hover:border-brand hover:text-brand">Sua</button>
        <button onClick={() => setPwOpen((v) => !v)} className="rounded-lg border px-3 py-1 text-sm font-semibold hover:border-brand hover:text-brand">Dat lai mat khau</button>
        <button onClick={handleDelete} disabled={pending} className="rounded-lg border border-red-300 px-3 py-1 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60">Xoa tai khoan</button>
        {pwOpen ? (
          <div className="mt-2 flex w-full flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-3">
            <input type="text" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Mat khau moi (>= 6 ky tu)" className="min-w-[200px] flex-1 rounded border px-3 py-2 text-sm" />
            <button onClick={handleSetPw} disabled={pending || pw.trim().length < 6} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "..." : "Xac nhan"}</button>
            <button onClick={() => { setPwOpen(false); setPw(""); }} className="rounded-lg border px-4 py-2 text-sm">Dong</button>
          </div>
        ) : null}
        {err ? <p className="w-full text-xs text-red-600">{err}</p> : null}
        {msg ? <p className="w-full text-xs text-green-600">{msg}</p> : null}
      </div>
    );
  }
  return (
    <form action={formAction} className="mt-2 space-y-2 rounded-lg bg-gray-50 p-3">
      <input type="hidden" name="id" value={member.id} />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input name="full_name" defaultValue={member.full_name || ""} placeholder="Ho ten" className="rounded border px-3 py-2 text-sm" />
        <input name="phone" defaultValue={member.phone || ""} placeholder="SDT" className="rounded border px-3 py-2 text-sm" />
        <select name="membership_tier" defaultValue={member.membership_tier || "free"} className="rounded border px-3 py-2 text-sm">
          <option value="free">Mien phi</option>
          <option value="BASIC">Co ban</option>
          <option value="PRO">Chuyen nghiep</option>
          <option value="VIP">VIP</option>
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_admin" defaultChecked={!!member.is_admin} /> Quan tri vien</label>
      </div>
      {state?.error ? <p className="text-xs text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-xs text-green-600">Da luu.</p> : null}
      <div className="flex gap-2"><Save /><button type="button" onClick={() => setOpen(false)} className="rounded-lg border px-4 py-2 text-sm">Dong</button></div>
    </form>
  );
}
