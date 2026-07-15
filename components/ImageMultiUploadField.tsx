"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

/*
 * Truong tai nhieu anh len (Supabase Storage) roi luu mang URL (JSON) vao hidden input.
 * Dung cho tin tuc - toi da 5 anh.
 */
export default function ImageMultiUploadField({
  name,
  bucket = "news",
  initialUrls = [],
  label = "Hinh anh",
  max = 5,
}: {
  name: string;
  bucket?: string;
  initialUrls?: string[];
  label?: string;
  max?: number;
}) {
  const [urls, setUrls] = useState<string[]>(initialUrls ?? []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setError(null);
    const conLai = max - urls.length;
    if (conLai <= 0) {
      setError(`Chi duoc toi da ${max} anh.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    const danhSach = files.slice(0, conLai);
    setUploading(true);
    try {
      const moi: string[] = [];
      for (const file of danhSach) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 5 * 1024 * 1024) {
          setError("Moi anh toi da 5MB.");
          continue;
        }
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(bucket)
          .upload(path, file, { upsert: true, cacheControl: "3600" });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        moi.push(data.publicUrl);
      }
      setUrls((cur) => [...cur, ...moi].slice(0, max));
    } catch (err) {
      console.error(err);
      setError("Tai anh that bai. Vui long thu lai.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function xoa(idx: number) {
    setUrls((cur) => cur.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(urls)} readOnly />
      {urls.length > 0 ? (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {urls.map((u, i) => (
            <div key={u + i} className="relative aspect-square overflow-hidden rounded-lg border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt={`Anh ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => xoa(i)}
                className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-bold text-white"
              >
                X
              </button>
              {i === 0 ? (
                <span className="absolute bottom-1 left-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">Anh bia</span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onFiles}
        disabled={uploading || urls.length >= max}
        className="block w-full text-sm"
      />
      <p className="mt-1 text-xs text-gray-500">
        {uploading
          ? "Dang tai anh len..."
          : `Chon toi da ${max} anh (moi anh <= 5MB). Anh dau tien la anh bia. Da chon ${urls.length}/${max}.`}
      </p>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
