"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

// Truong tai anh len (Supabase Storage) roi luu URL vao hidden input de form gui di.
// Dung cho anh bia tin tuc — thay vi dan URL thu cong.
export default function ImageUploadField({
  name,
  bucket = "news",
  initialUrl = null,
  label = "Anh bia",
}: {
  name: string;
  bucket?: string;
  initialUrl?: string | null;
  label?: string;
}) {
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Vui long chon file anh.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Anh toi da 5MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true, cacheControl: "3600" });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (err) {
      console.error(err);
      setError("Tai anh that bai. Vui long thu lai.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input type="hidden" name={name} value={url ?? ""} readOnly />
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Anh bia" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              Chua co anh
            </div>
          )}
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFile}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            {uploading ? "Dang tai..." : url ? "Doi anh khac" : "Tai anh len"}
          </button>
          {url && (
            <button
              type="button"
              onClick={() => setUrl(null)}
              className="ml-2 text-sm text-red-600 hover:underline"
            >
              Xoa
            </button>
          )}
          <p className="mt-1 text-xs text-gray-400">JPG, PNG, WEBP. Toi da 5MB.</p>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
