"use client";
import { useState, useTransition } from "react";
import { adminUpdatePost, adminSetPostState, type AdminState } from "@/app/actions/admin";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

type P = { id: number; title: string | null; gia: string | null; dien_tich: string | null; quan: string | null; mota: string | null; status: string | null; trang_thai: string | null };

function Save() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "..." : "Lưu"}</button>;
}

export default function PostAdminItem({ post }: { post: P }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<AdminState, FormData>(adminUpdatePost, {});
  const [isPending, startTransition] = useTransition();
  const hidden = post.trang_thai !== "duyet";
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold">{post.title || "(không tiêu đề)"}</p>
          <p className="text-sm text-gray-500">{post.quan} · {post.gia} · {post.dien_tich} {hidden ? <span className="ml-2 rounded bg-gray-200 px-2 py-0.5 text-xs">Đang ẩn</span> : <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Công khai</span>}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setOpen(!open)} className="rounded-lg border px-3 py-1 text-sm font-semibold hover:border-brand hover:text-brand">Sửa</button>
          <button disabled={isPending} onClick={() => startTransition(() => adminSetPostState(post.id, hidden ? "duyet" : "an"))} className="rounded-lg border px-3 py-1 text-sm font-semibold">{hidden ? "Hiện" : "Ẩn"}</button>
        </div>
      </div>
      {open ? (
        <form action={formAction} className="mt-3 space-y-2 rounded-lg bg-gray-50 p-3">
          <input type="hidden" name="id" value={post.id} />
          <input name="title" defaultValue={post.title || ""} placeholder="Tiêu đề" className="w-full rounded border px-3 py-2 text-sm" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <input name="gia" defaultValue={post.gia || ""} placeholder="Giá" className="rounded border px-3 py-2 text-sm" />
            <input name="dien_tich" defaultValue={post.dien_tich || ""} placeholder="Diện tích" className="rounded border px-3 py-2 text-sm" />
            <input name="quan" defaultValue={post.quan || ""} placeholder="Quận" className="rounded border px-3 py-2 text-sm" />
          </div>
          <textarea name="mota" defaultValue={post.mota || ""} rows={3} placeholder="Mô tả" className="w-full rounded border px-3 py-2 text-sm" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <select name="status" defaultValue={post.status || "thuong"} className="rounded border px-3 py-2 text-sm"><option value="thuong">Tin thường</option><option value="vang">Vàng</option><option value="kim_cuong">Kim cương</option></select>
            <select name="trang_thai" defaultValue={post.trang_thai || "duyet"} className="rounded border px-3 py-2 text-sm"><option value="duyet">Công khai</option><option value="an">Ẩn</option><option value="cho">Chờ duyệt</option></select>
          </div>
          {state?.error ? <p className="text-xs text-red-600">{state.error}</p> : null}
          {state?.success ? <p className="text-xs text-green-600">Đã lưu.</p> : null}
          <div className="flex gap-2"><Save /><button type="button" onClick={() => setOpen(false)} className="rounded-lg border px-4 py-2 text-sm">Đóng</button></div>
        </form>
      ) : null}
    </div>
  );
}
