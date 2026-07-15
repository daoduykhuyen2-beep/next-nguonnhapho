"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminDeleteNews, type AdminState } from "@/app/actions/admin";

function DelBtn({ tieuDe }: { tieuDe: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(`Xóa bài viết "${tieuDe}"? Hành động này không thể hoàn tác.`)) {
          e.preventDefault();
        }
      }}
      className="font-medium text-red-600 hover:underline disabled:opacity-60"
    >
      {pending ? "Đang xóa..." : "Xóa"}
    </button>
  );
}

export default function NewsDeleteButton({ id, tieuDe }: { id: string; tieuDe: string }) {
  const [state, formAction] = useActionState<AdminState, FormData>(adminDeleteNews, {});
  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="id" value={String(id)} />
      <DelBtn tieuDe={tieuDe} />
      {state?.error ? <span className="ml-2 text-xs text-red-600">{state.error}</span> : null}
    </form>
  );
}
