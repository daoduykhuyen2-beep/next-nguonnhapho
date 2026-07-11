"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { adminSaveBanner, type AdminState } from "@/app/actions/admin";
import { uploadPostImages } from "@/lib/upload";

export type BannerRow = {
  id: number;
  image_url: string | null;
  title: string | null;
  subtitle: string | null;
  link: string | null;
  sort: number;
  active: boolean;
};

function Save() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand px-6 py-3 font-semibold text-white disabled:opacity-60"
    >
      {pending ? "Đang lưu..." : "Lưu banner"}
    </button>
  );
}

export default function BannerForm({ banner }: { banner?: BannerRow }) {
  const [state, formAction] = useActionState<AdminState, FormData>(adminSaveBanner, {});
  const [imageUrl, setImageUrl] = useState(banner?.image_url || "");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setErr("");
    setUploading(true);
    try {
      const urls = await uploadPostImages([files[0]]);
      if (urls[0]) setImageUrl(urls[0]);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Tải ảnh thất bại");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {banner ? <input type="hidden" name="id" value={banner.id} /> : null}
      <input type="hidden" name="image_url" value={imageUrl} />

      <div>
        <label className="mb-1 block text-sm font-medium">Ảnh banner</label>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="banner"
            className="mb-2 h-40 w-full rounded-lg object-cover"
          />
        ) : (
          <div className="mb-2 flex h-40 w-full items-center justify-center rounded-lg border border-dashed text-sm text-gray-400">
            Chưa có ảnh
          </div>
        )}
        <input type="file" accept="image/*" onChange={onPick} className="text-sm" />
        {uploading ? <p className="mt-1 text-sm text-brand">Đang tải ảnh...</p> : null}
        {err ? <p className="mt-1 text-sm text-red-600">{err}</p> : null}
        <p className="mt-1 text-xs text-gray-500">
          Để trống ảnh sẽ hiển thị nền gradient mặc định.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Tiêu đề</label>
        <input
          name="title"
          defaultValue={banner?.title || ""}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Mô tả ngắn</label>
        <input
          name="subtitle"
          defaultValue={banner?.subtitle || ""}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Liên kết khi bấm (VD: /tin-dang)</label>
        <input
          name="link"
          defaultValue={banner?.link || ""}
          placeholder="/tin-dang"
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Thứ tự</label>
          <input
            type="number"
            name="sort"
            defaultValue={banner?.sort ?? 0}
            className="w-28 rounded-lg border px-4 py-3"
          />
        </div>
        <label className="mt-6 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="active"
            defaultChecked={banner ? banner.active : true}
          />
          Hiển thị
        </label>
      </div>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-green-600">Đã lưu banner.</p> : null}

      <Save />
    </form>
  );
}
