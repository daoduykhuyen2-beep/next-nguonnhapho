"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { updatePost } from "@/app/actions/posts";
import { uploadPostImages } from "@/lib/upload";
import type { Post } from "@/lib/types";

const LOAI_OPTIONS = ["Bán nhà", "Bán đất", "Cho thuê", "Căn hộ", "Khác"];

function SubmitButton({ uploading }: { uploading: boolean }) {
  const { pending } = useFormStatus();
  const disabled = pending || uploading;
  return (
    <button
      type="submit"
      disabled={disabled}
      className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {uploading ? "Đang tải ảnh..." : pending ? "Đang lưu..." : "Lưu thay đổi"}
    </button>
  );
}

export default function EditPostForm({ post }: { post: Post }) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existing, setExisting] = useState<string[]>(
    Array.isArray(post.anh) ? (post.anh as string[]) : []
  );

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files || []);
    setFiles(list);
    setPreviews(list.map((f) => URL.createObjectURL(f)));
  }

  function removeExisting(url: string) {
    setExisting((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      let urls: string[] = [...existing];
      if (files.length > 0) {
        setUploading(true);
        const uploaded = await uploadPostImages(files);
        urls = [...urls, ...uploaded];
        setUploading(false);
      }
      formData.set("anh", JSON.stringify(urls));
      const res = await updatePost(post.id, { error: undefined }, formData);
      if (res?.error) setError(res.error);
    } catch (err: any) {
      setUploading(false);
      setError(err?.message || "Có lỗi xảy ra");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <Field name="title" label="Tiêu đề" required defaultValue={post.title} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Loại tin</label>
          <select
            name="loai"
            defaultValue={post.loai || LOAI_OPTIONS[0]}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            {LOAI_OPTIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <Field name="gia" label="Giá (VD: 2.5 tỷ)" defaultValue={post.gia} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field name="dien_tich" label="Diện tích (m²)" defaultValue={post.dien_tich} />
        <Field name="quan" label="Quận/Huyện" defaultValue={post.quan} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field name="phuong" label="Phường/Xã" defaultValue={post.phuong} />
        <Field name="duong" label="Đường" defaultValue={post.duong} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Mô tả</label>
        <textarea
          name="mota"
          rows={5}
          defaultValue={post.mota || ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Hình ảnh</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onPick}
          className="block w-full text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">Thêm ảnh mới hoặc xoá ảnh cũ bên dưới.</p>

        {existing.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {existing.map((url) => (
              <div key={url} className="relative">
                <img src={url} alt="" className="h-20 w-full rounded object-cover" />
                <button
                  type="button"
                  onClick={() => removeExisting(url)}
                  className="absolute right-1 top-1 rounded bg-black/60 px-1 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {previews.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="h-20 w-full rounded object-cover" />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field name="video" label="Link video (tùy chọn)" defaultValue={post.video} />
        <Field name="contact_name" label="Tên liên hệ" defaultValue={post.contact_name} />
      </div>
      <Field name="contact_phone" label="Số điện thoại" defaultValue={post.contact_phone} />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <SubmitButton uploading={uploading} />
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
  defaultValue?: string | number | null;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
      />
    </div>
  );
}
