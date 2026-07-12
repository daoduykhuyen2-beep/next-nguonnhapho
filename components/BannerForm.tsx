"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveBanner, type BannerState } from "@/app/actions/banner";

function Save() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand px-6 py-3 font-semibold text-white disabled:opacity-60"
    >
      {pending ? "Đang lưu..." : "Thêm banner"}
    </button>
  );
}

export default function BannerForm() {
  const [state, formAction] = useActionState<BannerState, FormData>(saveBanner, {});
  return (
    <form action={formAction} className="max-w-2xl space-y-4 rounded-xl border bg-white p-5">
      <h3 className="text-lg font-bold">Thêm banner mới</h3>
      <div>
        <label className="mb-1 block text-sm font-medium">Link ảnh banner (URL) *</label>
        <input name="image_url" required placeholder="https://..." className="w-full rounded-lg border px-4 py-3" />
        <p className="mt-1 text-xs text-gray-500">Dán link ảnh (nên dùng ảnh ngang, tỉ lệ ~ 16:9 hoặc 3:1).</p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Tiêu đề (không bắt buộc)</label>
        <input name="title" className="w-full rounded-lg border px-4 py-3" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Link khi bấm vào (không bắt buộc)</label>
        <input name="link_url" placeholder="https://... hoặc /tin-dang" className="w-full rounded-lg border px-4 py-3" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Thứ tự hiển thị</label>
        <input name="sort_order" type="number" defaultValue={0} className="w-32 rounded-lg border px-4 py-3" />
        <p className="mt-1 text-xs text-gray-500">Số nhỏ hiển thị trước.</p>
      </div>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-green-600">Đã thêm banner. Tải lại trang để xem danh sách.</p> : null}
      <Save />
    </form>
  );
}
