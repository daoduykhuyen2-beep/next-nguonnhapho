"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { updatePost } from "@/app/actions/posts";
import { uploadPostImages } from "@/lib/upload";
import type { Post } from "@/lib/types";

const LOAI_OPTIONS = ["BÃ¡n nhÃ ", "BÃ¡n Äáº¥t", "Cho thuÃª", "CÄn há»", "KhÃ¡c", "Cá»c nhÃ ", "Chá»t nhÃ "];

function SubmitButton({ uploading }: { uploading: boolean }) {
  const { pending } = useFormStatus();
  const disabled = pending || uploading;
  return (
    <button
      type="submit"
      disabled={disabled}
      className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {uploading ? "Äang táº£i áº£nh..." : pending ? "Äang lÆ°u..." : "LÆ°u thay Äá»i"}
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
    const all = Array.from(e.target.files || []);
    const list = all.slice(0, 5);
    if (all.length > 5) {
      setError("Chá» ÄÆ°á»£c táº£i lÃªn tá»i Äa 5 áº£nh. Há» thá»ng ÄÃ£ tá»± giá»¯ láº¡i 5 áº£nh Äáº§u.");
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
      const res = await updatePost(post.id, { error: undefined }, formData);
      if (res?.error) setError(res.error);
    } catch (err: any) {
      if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
      setUploading(false);
      setError(err?.message || "CÃ³ lá»i xáº£y ra");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <Field name="title" label="TiÃªu Äá»" required defaultValue={post.title} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Loáº¡i tin</label>
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
        <Field name="gia" label="GiÃ¡ (VD: 2.5 tá»·)" defaultValue={post.gia} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field name="dien_tich" label="Diá»n tÃ­ch (mÂ²)" defaultValue={post.dien_tich} />
        <Field name="quan" label="Quáº­n/Huyá»n" defaultValue={post.quan} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field name="chieu_ngang" label="Chiá»u ngang (m)" defaultValue={post.chieu_ngang} />
        <Field name="chieu_dai" label="Chiá»u dÃ i (m)" defaultValue={post.chieu_dai} />
        <Field name="so_tang" label="Sá» táº§ng" defaultValue={post.so_tang} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field name="phuong" label="PhÆ°á»ng/XÃ£" defaultValue={post.phuong} />
        <Field name="duong" label="ÄÆ°á»ng" defaultValue={post.duong} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">MÃ´ táº£</label>
        <textarea
          name="mota"
          rows={5}
          defaultValue={post.mota || ""}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">HÃ¬nh áº£nh</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onPick}
          className="block w-full text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">ThÃªm áº£nh má»i hoáº·c xoÃ¡ áº£nh cÅ© bÃªn dÆ°á»i.</p>

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
                  â
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
        <Field name="video" label="Link video TikTok (tÃ¹y chá»n)" defaultValue={post?.video} placeholder="DÃ¡n link video TikTok, vÃ­ dá»¥: https://www.tiktok.com/@user/video/..." />
        <Field name="contact_name" label="TÃªn liÃªn há»" defaultValue={post.contact_name} />
      </div>
      <Field name="contact_phone" label="Sá» Äiá»n thoáº¡i" defaultValue={post.contact_phone} />

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
