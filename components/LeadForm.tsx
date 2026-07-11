"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createLead, type LeadState } from "@/app/actions/leads";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Dang gui..." : "Gui yeu cau lien he"}
    </button>
  );
}

export default function LeadForm({ postId }: { postId: number }) {
  const [state, formAction] = useActionState<LeadState, FormData>(
    createLead,
    {}
  );

  if (state.success) {
    return (
      <div className="mt-3 rounded-lg bg-green-50 px-3 py-3 text-sm text-green-700">
        Cam on ban! Thong tin da duoc gui toi nguoi dang tin. Ho se lien he
        voi ban som nhat.
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-3 space-y-2">
      <input type="hidden" name="post_id" value={postId} />
      <p className="text-sm font-semibold text-gray-700">
        De lai so dien thoai de duoc lien he
      </p>
      <input
        name="name"
        placeholder="Ho ten (khong bat buoc)"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      <input
        name="phone"
        required
        inputMode="tel"
        placeholder="So dien thoai *"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      <textarea
        name="note"
        rows={2}
        placeholder="Loi nhan (khong bat buoc)"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
      <SubmitBtn />
    </form>
  );
}
