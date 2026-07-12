"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminSaveNews, type AdminState } from "@/app/actions/admin";
import ImageUploadField from "@/components/ImageUploadField";

function Save() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="rounded-lg bg-brand px-6 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Đang lưu..." : "Lưu bài viết"}</button>;
}

export default function NewsForm() {
  const [state, formAction] = useActionState<AdminState, FormData>(adminSaveNews, {});
  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div><label className="mb-1 block text-sm font-medium">Tiêu đề</label><input name="tieu_de" required className="w-full rounded-lg border px-4 py-3" /></div>
      <div><label className="mb-1 block text-sm font-medium">Mô tả ngắn</label><input name="mo_ta" className="w-full rounded-lg border px-4 py-3" /></div>
      <ImageUploadField name="anh_bia" bucket="news" label="Ảnh bìa (tải ảnh lên)" />
      <div><label className="mb-1 block text-sm font-medium">Nội dung</label><textarea name="noi_dung" rows={8} className="w-full rounded-lg border px-4 py-3" /></div>
      <div><label className="mb-1 block text-sm font-medium">Loại</label><select name="loai" className="rounded-lg border px-4 py-3"><option value="tin_tuc">Tin tức</option><option value="video">Video</option><option value="canh_bao">Cảnh báo</option></select></div>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-green-600">Đã lưu bài viết.</p> : null}
      <Save />
    </form>
  );
}
