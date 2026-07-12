"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminDuyetThanhToan, type DuyetState } from "@/app/actions/duyet-thanh-toan";

function DuyetBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Đang duyệt..." : "Duyệt thủ công"}
    </button>
  );
}

export default function DuyetThanhToanButton({ id }: { id: number | string }) {
  const [state, formAction] = useActionState<DuyetState, FormData>(
    adminDuyetThanhToan,
    {}
  );
  return (
    <form action={formAction} className="flex flex-col gap-1">
      <input type="hidden" name="id" value={String(id)} />
      <DuyetBtn />
      {state?.error && (
        <span className="text-[11px] text-red-600">{state.error}</span>
      )}
      {state?.success && (
        <span className="text-[11px] text-green-600">
          {state.message || "Đã duyệt thành công."}
        </span>
      )}
    </form>
  );
}
