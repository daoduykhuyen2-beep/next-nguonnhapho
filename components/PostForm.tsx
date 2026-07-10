"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createPost, type ActionState } from "@/app/actions/posts";

const LOAI_OPTIONS = ["Bán nhà", "Cho thuê", "Đất nền", "Căn hộ"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand px-6 py-2 font-semibold text-white disabled:opacity-60"
    >
      {pending ? "Đang đăng..." : "Đăng tin"}
    </button>
  );
}

export default function PostForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createPost,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4 rounded-xl border bg-white p-6">
      <Field name="title" label="Tiêu đề *" required />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Loại</label>
          <select
            name="loai"
            className="w-full rounded-md border px-3 py-2"
            defaultValue=""
          >
            <option value="">-- Chọn loại --</option>
            {LOAI_OPTIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <Field name="gia" label="Giá (VD: 3.5 tỷ)" />
        <Field name="dien_tich" label="Diện tích (VD: 60m²)" />
        <Field name="quan" label="Quận/Huyện" />
        <Field name="phuong" label="Phường/Xã" />
        <Field name="duong" label="Đường" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Mô tả</label>
        <textarea
          name="mota"
          rows={5}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Link ảnh (mỗi dòng 1 link, hoặc ngăn cách bởi dấu phẩy)
        </label>
        <textarea
          name="imgs"
          rows={3}
          placeholder="https://..."
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <Field name="video" label="Link video (tuỳ chọn)" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field name="contact_name" label="Tên liên hệ" />
        <Field name="contact_phone" label="Số điện thoại liên hệ" />
      </div>

      {state?.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}

      <SubmitButton />
    </form>
  );
}

function Field({
  name,
  label,
  required,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type="text"
        name={name}
        required={required}
        className="w-full rounded-md border px-3 py-2"
      />
    </div>
  );
}
