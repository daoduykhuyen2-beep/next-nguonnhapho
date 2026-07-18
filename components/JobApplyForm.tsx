"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createJobApplication,
  type JobApplyState,
} from "@/app/actions/jobApplications";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
    >
      {pending ? "Đang gửi..." : "Gửi hồ sơ ứng tuyển"}
    </button>
  );
}

export default function JobApplyForm({ viTriList }: { viTriList: string[] }) {
  const [state, formAction] = useActionState<JobApplyState, FormData>(
    createJobApplication,
    {}
  );

  if (state.success) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-700">
        <div className="mb-1 text-2xl">✅</div>
        Đã nhận hồ sơ của bạn! Bộ phận tuyển dụng sẽ liên hệ lại sớm nhất.
      </div>
    );
  }

  return (
    <form action={formAction} className="mx-auto max-w-md space-y-3 text-left">
      <input
        name="ho_ten"
        placeholder="Họ và tên"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      <input
        name="phone"
        required
        placeholder="Số điện thoại *"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      <select
        name="vi_tri"
        defaultValue=""
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="">-- Chọn vị trí ứng tuyển --</option>
        {viTriList.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
      <textarea
        name="loi_nhan"
        rows={3}
        placeholder="Kinh nghiệm / lời nhắn (không bắt buộc)"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
      <SubmitButton />
      <p className="text-center text-xs text-gray-500">
        Thông tin của bạn được gửi riêng cho bộ phận tuyển dụng.
      </p>
    </form>
  );
}
