"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { QuanStat } from "@/lib/stats";

const LOAI_OPTIONS = ["Bán nhà", "Cho thuê", "Đất nền", "Căn hộ"];

export default function PostFilter({ quanOptions = [] }: { quanOptions?: QuanStat[] }) {
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
      <select
        value={quan}
        onChange={(e) => update("quan", e.target.value)}
        className="w-[200px] rounded-md border px-3 py-2 text-sm"
      >
        <option value="">Tất cả quận/huyện</option>
        {quanOptions.map((o) => (
          <option key={o.quan} value={o.quan}>
            {o.quan} ({o.so_can})
          </option>
        ))}
      </select>
    </div>
  );
}
