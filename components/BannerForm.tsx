"use client";

import { useState, useRef } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveBanner, type BannerState } from "@/app/actions/banner";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "post-images";

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
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    if (!file.type.startsWith("image/")) {
      setUploadError("Vui lòng chọn file ảnh.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ảnh tối đa 5MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `banner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, cacheControl: "3600" });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } catch (err) {
      console.error(err);
      setUploadError("Tải ảnh thất bại. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-4 rounded-xl border bg-white p-5">
      <h3 className="text-lg font-bold">Thêm banner mới</h3>

      <div>
        <label className="mb-1 block text-sm font-medium">Tải ảnh banner lên</label>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Xem trước banner" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                Chưa có ảnh
              </div>
            )}
          </div>
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onFile}
              className="block w-full text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              {uploading ? "Đang tải ảnh lên..." : "Chọn ảnh từ máy (tối đa 5MB). Ảnh nên nằm ngang, tỉ lệ 16:9 hoặc 3:1."}
            </p>
            {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
          </div>
        </div>
      </div>

      <div>
        {/* image_url chi duoc set qua upload anh, khong cho nhap link thu cong */}
        <input type={"hidden"} name={"image_url"} value={imageUrl} readOnly />
        <p className={"text-xs text-gray-500"}>
          {imageUrl
            ? "✓ Đã có ảnh. Bấm “Thêm banner” để lưu."
            : "Vui lòng tải ảnh banner lên ở trên (chỉ nhận ảnh tải lên, không dán link)."}
        </p>
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
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? (
        <p className="text-sm text-green-600">Đã thêm banner. Tải lại trang để xem danh sách.</p>
      ) : null}
      <Save />
    </form>
  );
}
