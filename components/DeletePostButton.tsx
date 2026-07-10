"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePost } from "@/app/actions/posts";

export default function DeletePostButton({ id }: { id: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function handleDelete() {
    if (!confirm("Bạn có chắc muốn xoá tin này?")) return;
    startTransition(async () => {
      const res = await deletePost(id);
      if (res?.error) {
        setErr(res.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="inline-flex flex-col items-end">
      <button
        onClick={handleDelete}
        disabled={pending}
        className="rounded-md border border-red-500 px-3 py-1 text-sm font-medium text-red-600 disabled:opacity-60"
      >
        {pending ? "Đang xoá..." : "Xoá"}
      </button>
      {err ? <span className="mt-1 text-xs text-red-600">{err}</span> : null}
    </div>
  );
}
