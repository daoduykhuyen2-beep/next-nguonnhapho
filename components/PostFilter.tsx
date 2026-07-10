"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const LOAI_OPTIONS = ["Bán nhà", "Cho thuê", "Đất nền", "Căn hộ"];

export default function PostFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const loai = searchParams.get("loai") ?? "";
  const quan = searchParams.get("quan") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/tin-dang?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="mb-6 flex flex-wrap gap-3 rounded-lg border bg-white p-4">
      <input
        type="text"
        defaultValue={q}
        placeholder="Tìm theo tiêu đề, địa chỉ..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            update("q", (e.target as HTMLInputElement).value.trim());
          }
        }}
        className="min-w-[200px] flex-1 rounded-md border px-3 py-2 text-sm"
      />
      <select
        value={loai}
        onChange={(e) => update("loai", e.target.value)}
        className="rounded-md border px-3 py-2 text-sm"
      >
        <option value="">Tất cả loại</option>
        {LOAI_OPTIONS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <input
        type="text"
        defaultValue={quan}
        placeholder="Quận/Huyện"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            update("quan", (e.target as HTMLInputElement).value.trim());
          }
        }}
        className="w-[160px] rounded-md border px-3 py-2 text-sm"
      />
    </div>
  );
}
