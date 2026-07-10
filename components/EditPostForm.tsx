"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updatePost, type ActionState } from "@/app/actions/posts";
import type { Post } from "@/lib/types";

const LOAI_OPTIONS = ["Bán nhà", "Cho thuê", "Đất nền", "Căn hộ"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand px-6 py-2 font-semibold text-white disabled:opacity-60"
    >
      {pending ? "Đang lưu..." : "Lưu thay đổi"}
    </button>
  );
}

export default function EditPostForm({ post }: { post: Post }) {
  const action = updatePost.bind(null, post.id);
  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    undefined
  );
  const imgsText = (post.anh?.imgs ?? []).join("\n");

  return (
    <form action={formAction} className="space-y-4 rounded-xl border bg-white p-6">
      <Field name="title" label="Tiêu đề *" required defaultValue={post.title} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Loại</label>
          <select
            name="loai"
            className="w-full rounded-md border px-3 py-2"
            defaultValue={post.loai ?? ""}
          >
            <option value="">-- Chọn loại --</option>
            {LOAI_OPTIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <Field name="gia" label="Giá" defaultValue={post.gia} />
        <Field name="dien_tich" label="Diện tích" defaultValue={post.dien_tich} />
        <Field name="quan" label="Quận/Huyện" defaultValue={post.quan} />
        <Field name="phuong" label="Phường/Xã" defaultValue={post.phuong} />
        <Field name="duong" label="Đường" defaultValue={post.duong} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Mô tả</label>
        <textarea
          name="mota"
          rows={5}
          defaultValue={post.mota ?? ""}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Link ảnh (mỗi dòng 1 link)
        </label>
        <textarea
          name="imgs"
          rows={3}
          defaultValue={imgsText}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <Field name="video" label="Link video" defaultValue={post.video} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          name="contact_name"
          label="Tên liên hệ"
          defaultValue={post.contact_name}
        />
        <Field
          name="contact_phone"
          label="Số điện thoại"
          defaultValue={post.contact_phone}
        />
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
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string | null;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type="text"
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-md border px-3 py-2"
      />
    </div>
  );
}
