"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveHomeVideo, type HomeVideoState } from "@/app/actions/home-video";

function Save() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand px-6 py-3 font-semibold text-white disabled:opacity-60"
    >
      {pending ? "Đang lưu..." : "Thêm video"}
    </button>
  );
}

export default function HomeVideoForm() {
  const [state, formAction] = useActionState<HomeVideoState, FormData>(saveHomeVideo, {});
  return (
    <form action={formAction} className="space-y-4 rounded-xl border bg-white p-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Link video TikTok</label>
        <input
          name="tiktok_url"
          required
          placeholder="https://www.tiktok.com/@user/video/1234567890"
          className="w-full rounded-lg border px-4 py-3"
        />
        <p className="mt-1 text-xs text-gray-500">
          Mở video trên TikTok, bấm Chia sẻ → Sao chép liên kết rồi dán vào đây.
        </p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Tiêu đề (không bắt buộc)</label>
        <input name="title" className="w-full rounded-lg border px-4 py-3" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Thứ tự hiển thị</label>
        <input
          name="sort_order"
          type="number"
          defaultValue={0}
          className="w-full rounded-lg border px-4 py-3"
        />
        <p className="mt-1 text-xs text-gray-500">Số nhỏ hơn sẽ hiển thị trước.</p>
      </div>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-green-600">Đã thêm video.</p> : null}
      <Save />
    </form>
  );
}
