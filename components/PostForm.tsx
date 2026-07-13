"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createPost } from "@/app/actions/posts";
import { uploadPostImages } from "@/lib/upload";
import type { Post } from "@/lib/types";

const LOAI_OPTIONS = [
  { value: "ban", label: "NhÃ  bÃ¡n" },
  { value: "thue", label: "Cho thuÃª" },
  { value: "dat", label: "Äáº¥t ná»n" },
  { value: "can_ho", label: "CÄn há»" },
  { value: "coc", label: "Cá»c nhÃ " },
  { value: "chot", label: "Chá»t nhÃ " },
  { value: "khac", label: "KhÃ¡c" },
];

const DON_VI_OPTIONS = [
  { value: "ty", label: "Tá»·" },
  { value: "trieu", label: "Triá»u" },
  { value: "trieu_thang", label: "Triá»u/thÃ¡ng" },
  { value: "vnd", label: "VNÄ" },
  { value: "thoathuan", label: "Thá»a thuáº­n" },
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
      {uploading ? "Äang táº£i áº£nh..." : pending ? "Äang ÄÄng tin..." : "ÄÄng tin"}
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
      const res = await createPost({ error: undefined }, formData);
      if (res?.error) setError(res.error);
    } catch (err: any) {
      if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
      setUploading(false);
      setError(err?.message || "CÃ³ lá»i xáº£y ra");
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* 1. ThÃ´ng tin cÆ¡ báº£n */}
      <Section title="ThÃ´ng tin cÆ¡ báº£n" desc="TiÃªu Äá», loáº¡i tin vÃ  giÃ¡ rao">
        <Field name="title" label="TiÃªu Äá»" required defaultValue={post?.title} placeholder="VD: BÃ¡n nhÃ  máº·t phá» Nguyá»n TrÃ£i, Q1" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Loáº¡i tin</label>
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
            <label className="mb-1 block text-sm font-medium">GiÃ¡ rao</label>
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
            <p className="mt-1 text-xs text-gray-500">Chá» nháº­p sá», chá»n ÄÆ¡n vá» bÃªn cáº¡nh (VD: 27 â 27 tá»·).</p>
          </div>
        </div>
      </Section>

      {/* 2. Diá»n tÃ­ch & KÃ­ch thÆ°á»c */}
      <Section title="Diá»n tÃ­ch & KÃ­ch thÆ°á»c">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field name="dien_tich" label="Diá»n tÃ­ch (mÂ²)" defaultValue={post?.dien_tich} placeholder="VD: 80" />
          <Field name="so_tang" label="Sá» táº§ng" defaultValue={post?.so_tang} placeholder="VD: 4" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field name="chieu_ngang" label="Chiá»u ngang (m)" defaultValue={post?.chieu_ngang} placeholder="VD: 4" />
          <Field name="chieu_dai" label="Chiá»u dÃ i (m)" defaultValue={post?.chieu_dai} placeholder="VD: 20" />
        </div>
      </Section>

      {/* 3. Vá» trÃ­ */}
      <Section title="Vá» trÃ­ báº¥t Äá»ng sáº£n">
        <Field name="quan" label="Quáº­n/Huyá»n" defaultValue={post?.quan} placeholder="VD: Quáº­n 1" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field name="phuong" label="PhÆ°á»ng/XÃ£" defaultValue={post?.phuong} placeholder="VD: Báº¿n ThÃ nh" />
          <Field name="duong" label="ÄÆ°á»ng" defaultValue={post?.duong} placeholder="VD: Nguyá»n TrÃ£i" />
        </div>
      </Section>

      {/* 4. MÃ´ táº£ */}
      <Section title="MÃ´ táº£ chi tiáº¿t">
        <div>
          <label className="mb-1 block text-sm font-medium">MÃ´ táº£</label>
          <textarea
            name="mota"
            rows={5}
            defaultValue={post?.mota || ""}
            placeholder="MÃ´ táº£ chi tiáº¿t vá» báº¥t Äá»ng sáº£n: phÃ¡p lÃ½, hÆ°á»ng, tiá»n Ã­ch xung quanh..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      </Section>

      {/* 5. HÃ¬nh áº£nh & Video */}
      <Section title="HÃ¬nh áº£nh & Video" desc="HÃ¬nh áº£nh Äáº¹p giÃºp tin ÄÄng thu hÃºt hÆ¡n">
        <div>
          <label className="mb-1 block text-sm font-medium">HÃ¬nh áº£nh</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onPick}
            className="block w-full text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">Chá»n tá»i Äa 5 áº£nh, má»i áº£nh tá»i Äa 5MB.</p>

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
                    Ã
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
        <Field name="video" label="Link video TikTok (tÃ¹y chá»n)" defaultValue={post?.video} placeholder="DÃ¡n link video TikTok, vÃ­ dá»¥: https://www.tiktok.com/@user/video/..." />
      </Section>

      {/* 6. ThÃ´ng tin liÃªn há» */}
      <Section title="ThÃ´ng tin liÃªn há»">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field name="contact_name" label="TÃªn liÃªn há»" defaultValue={post?.contact_name} placeholder="Há» tÃªn" />
          <Field name="contact_phone" label="Sá» Äiá»n thoáº¡i" defaultValue={post?.contact_phone} placeholder="Sá» Äiá»n thoáº¡i liÃªn há»" />
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
