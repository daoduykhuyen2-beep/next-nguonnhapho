"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { createPost } from "@/app/actions/posts";
import { uploadPostImages } from "@/lib/upload";
import type { Post } from "@/lib/types";

const LOAI_OPTIONS = [
  { value: "ban", label: "Nhà bán" },
  { value: "thue", label: "Cho thuê" },
  { value: "dat", label: "Đất nền" },
  { value: "can_ho", label: "Căn hộ" },
  { value: "coc", label: "Cọc nhà" },
  { value: "chot", label: "Chốt nhà" },
  { value: "khac", label: "Khác" },
];

const DON_VI_OPTIONS = [
  { value: "ty", label: "Tỷ" },
  { value: "trieu", label: "Triệu" },
  { value: "trieu_thang", label: "Triệu/tháng" },
  { value: "vnd", label: "VNĐ" },
  { value: "thoathuan", label: "Thỏa thuận" },
];

function SubmitButton({ uploading }: { uploading: boolean }) {
  const { pending } = useFormStatus();
  const disabled = pending || uploading;
  return (
    <button
      type="submit"
      disabled={disabled}
      className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {uploading ? "Đang tải ảnh..." : pending ? "Đang đăng tin..." : "Đăng tin"}
    </button>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 border-b border-gray-100 pb-3">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {desc && <p className="mt-0.5 text-xs text-gray-500">{desc}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existing, setExisting] = useState<string[]>(
    Array.isArray(post?.anh) ? (post!.anh as string[]) : []
  );
  const [loai, setLoai] = useState<string>(post?.loai || LOAI_OPTIONS[0].value);
  const [donVi, setDonVi] = useState<string>(
    post?.loai === "thue" ? "vnd" : "ty"
  );

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const all = Array.from(e.target.files || []);
    const list = all.slice(0, 5);
    if (all.length > 5) {
      setError("Chỉ được tải lên tối đa 5 ảnh. Hệ thống đã tự giữ lại 5 ảnh đầu.");
    } else {
      setError(null);
    }
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
      const res = await createPost({ error: undefined }, formData);
      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/tai-khoan/tin-cua-toi");
        router.refresh();
      }
    } catch (err: any) {
      setUploading(false);
      setError(err?.message || "Có lỗi xảy ra");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* 1. Thông tin cơ bản */}
      <Section title="Thông tin cơ bản" desc="Tiêu đề, loại tin và giá rao">
        <Field name="title" label="Tiêu đề" required defaultValue={post?.title} placeholder="VD: Bán nhà mặt phố Nguyễn Trãi, Q1" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Loại tin</label>
            <select
              name="loai"
              value={loai}
              onChange={(e) => {
                const v = e.target.value;
                setLoai(v);
                setDonVi(v === "thue" ? "vnd" : "ty");
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              {LOAI_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Giá rao</label>
            <div className="flex gap-2">
              <input
                name="gia"
                defaultValue={post?.gia ?? ""}
                placeholder={loai === "thue" ? "VD: 8.000.000" : "VD: 27"}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
              <select
                name="gia_don_vi"
                value={donVi}
                onChange={(e) => setDonVi(e.target.value)}
                className="w-36 shrink-0 rounded-lg border border-gray-300 px-2 py-2"
              >
                {DON_VI_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-xs text-gray-500">Chỉ nhập số, chọn đơn vị bên cạnh (VD: 27 → 27 tỷ).</p>
          </div>
        </div>
      </Section>

      {/* 2. Diện tích & Kích thước */}
      <Section title="Diện tích & Kích thước">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field name="dien_tich" label="Diện tích (m²)" defaultValue={post?.dien_tich} placeholder="VD: 80" />
          <Field name="so_tang" label="Số tầng" defaultValue={post?.so_tang} placeholder="VD: 4" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field name="chieu_ngang" label="Chiều ngang (m)" defaultValue={post?.chieu_ngang} placeholder="VD: 4" />
          <Field name="chieu_dai" label="Chiều dài (m)" defaultValue={post?.chieu_dai} placeholder="VD: 20" />
        </div>
      </Section>

      {/* 3. Vị trí */}
      <Section title="Vị trí bất động sản">
        <Field name="quan" label="Quận/Huyện" defaultValue={post?.quan} placeholder="VD: Quận 1" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field name="phuong" label="Phường/Xã" defaultValue={post?.phuong} placeholder="VD: Bến Thành" />
          <Field name="duong" label="Đường" defaultValue={post?.duong} placeholder="VD: Nguyễn Trãi" />
        </div>
      </Section>

      {/* 4. Mô tả */}
      <Section title="Mô tả chi tiết">
        <div>
          <label className="mb-1 block text-sm font-medium">Mô tả</label>
          <textarea
            name="mota"
            rows={5}
            defaultValue={post?.mota || ""}
            placeholder="Mô tả chi tiết về bất động sản: pháp lý, hướng, tiện ích xung quanh..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      </Section>

      {/* 5. Hình ảnh & Video */}
      <Section title="Hình ảnh & Video" desc="Hình ảnh đẹp giúp tin đăng thu hút hơn">
        <div>
          <label className="mb-1 block text-sm font-medium">Hình ảnh</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onPick}
            className="block w-full text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">Chọn tối đa 5 ảnh, mỗi ảnh tối đa 5MB.</p>

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
                    ×
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
        <Field name="video" label="Link video TikTok (tùy chọn)" defaultValue={post?.video} placeholder="Dán link video TikTok, ví dụ: https://www.tiktok.com/@user/video/..." />
      </Section>

      {/* 6. Thông tin liên hệ */}
      <Section title="Thông tin liên hệ">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field name="contact_name" label="Tên liên hệ" defaultValue={post?.contact_name} placeholder="Họ tên" />
          <Field name="contact_phone" label="Số điện thoại" defaultValue={post?.contact_phone} placeholder="Số điện thoại liên hệ" />
        </div>
      </Section>

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
  placeholder,
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string | number | null;
  placeholder?: string;
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
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
      />
    </div>
  );
}
