"use client";

import { useRef, useState } from "react";
import { showToast } from "./Toast";
import { createClient } from "@/lib/supabase/client";
import { updateAvatar } from "@/app/actions/profile";

export default function AvatarUpload({
  userId,
  currentUrl,
  fullName,
}: {
  userId: string;
  currentUrl: string | null;
  fullName: string | null;
}) {
  const [url, setUrl] = useState<string | null>(currentUrl);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = (fullName || "?")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(-2)
    .join("")
    .toUpperCase();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMsg(null);

    if (!file.type.startsWith("image/")) {
      setMsg("Vui lòng chọn tệp ảnh.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setMsg("Ảnh tối đa 3MB.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = userId + "/avatar_" + Date.now() + "." + ext;

      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, cacheControl: "3600" });
      if (upErr) {
        setMsg("Tải ảnh thất bại: " + upErr.message);
        showToast("Tải ảnh thất bại", "error");
        setBusy(false);
        return;
      }

      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = pub.publicUrl;

      const res = await updateAvatar(publicUrl);
      if (res.error) {
        setMsg(res.error);
        showToast(res.error, "error");
      } else {
        setUrl(publicUrl);
        setMsg("Đã cập nhật ảnh đại diện.");
        showToast("Đã cập nhật ảnh đại diện");
      }
    } catch (err) {
      setMsg("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Ảnh đại diện"
            className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-100"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-2xl font-bold text-brand ring-2 ring-gray-100">
            {initials}
          </div>
        )}
        {busy ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-xs text-white">
            Đang tải...
          </div>
        ) : null}
      </div>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
        >
          {url ? "Đổi ảnh đại diện" : "Tải ảnh đại diện"}
        </button>
        <p className="mt-1 text-xs text-gray-400">JPG, PNG — tối đa 3MB.</p>
        {msg ? (
          <p className="mt-1 text-xs text-brand">{msg}</p>
        ) : null}
      </div>
    </div>
  );
}
