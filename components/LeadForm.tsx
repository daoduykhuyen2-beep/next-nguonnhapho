"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createLead, type LeadState } from "@/app/actions/leads";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Đang gửi..." : "Gửi yêu cầu — nhận tư vấn"}
    </button>
  );
}

export default function LeadForm({ postId }: { postId: number }) {
  const [state, formAction] = useActionState<LeadState, FormData>(createLead, {});

  if (state.success) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-700">
        <div className="mb-1 text-2xl">✓</div>
        Đã gửi thông tin! Người đăng sẽ liên hệ lại với bạn sớm nhất.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="post_id" value={postId} />
      <p className="text-sm font-semibold text-gray-800">
        Quan tâm căn này? Để lại số điện thoại
      </p>
      <input
        name="name"
        placeholder="Họ tên của bạn"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      <input
        name="phone"
        required
        placeholder="Số điện thoại *"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      <textarea
        name="note"
        rows={2}
        placeholder="Lời nhắn (không bắt buộc)"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
      <SubmitButton />
      <p className="text-center text-xs text-gray-400">
        Thông tin của bạn được gửi riêng cho người đăng tin.
      </p>
    </form>
  );
}
