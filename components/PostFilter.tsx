"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { QuanStat } from "@/lib/stats";

const LOAI_OPTIONS = [
  { value: "ban", label: "Nhà bán" },
  { value: "thue", label: "Cho thuê" },
];

const GIA_OPTIONS = [
  { label: "Dưới 5 tỷ", min: "", max: "5" },
  { label: "5 - 10 tỷ", min: "5", max: "10" },
  { label: "10 - 20 tỷ", min: "10", max: "20" },
  { label: "20 - 50 tỷ", min: "20", max: "50" },
  { label: "Trên 50 tỷ", min: "50", max: "" },
];

const DT_OPTIONS = [
  { label: "Dưới 30 m²", min: "", max: "30" },
  { label: "30 - 50 m²", min: "30", max: "50" },
  { label: "50 - 100 m²", min: "50", max: "100" },
  { label: "100 - 200 m²", min: "100", max: "200" },
  { label: "Trên 200 m²", min: "200", max: "" },
];

const TANG_OPTIONS = ["1", "2", "3", "4", "5"];

export default function PostFilter({ quanOptions }: { quanOptions: QuanStat[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const loai = searchParams.get("loai") ?? "";
  const quan = searchParams.get("quan") ?? "";
  const duong = searchParams.get("duong") ?? "";
  const tang = searchParams.get("tang") ?? "";
  const giaKey = `${searchParams.get("giaMin") ?? ""}|${searchParams.get("giaMax") ?? ""}`;
  const dtKey = `${searchParams.get("dtMin") ?? ""}|${searchParams.get("dtMax") ?? ""}`;

  const update = useCallback(
    (entries: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(entries)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      params.delete("page");
      router.push(`/tin-dang?${params.toString()}`);
    },
    [router, searchParams]
  );

  const selectCls =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none";

  return (
    <div className="mb-6 flex flex-wrap gap-3 rounded-lg border bg-white p-4">
      <input
        type="text"
        defaultValue={q}
        placeholder="Tìm theo tiêu đề, địa chỉ..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            update({ q: (e.target as HTMLInputElement).value });
          }
        }}
        className={`${selectCls} min-w-[220px] flex-1`}
      />
      <input
        type="text"
        defaultValue={duong}
        placeholder="Tên đường..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            update({ duong: (e.target as HTMLInputElement).value });
          }
        }}
        className={`${selectCls} min-w-[160px]`}
      />
      <select
        value={loai}
        onChange={(e) => update({ loai: e.target.value })}
        className={selectCls}
      >
        <option value="">Loại nhà</option>
        {LOAI_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        value={quan}
        onChange={(e) => update({ quan: e.target.value })}
        className={selectCls}
      >
        <option value="">Toàn thành phố</option>
        {quanOptions.map((o) => (
          <option key={o.quan} value={o.quan}>
            {o.quan} ({o.count})
          </option>
        ))}
      </select>
      <select
        value={giaKey === "|" ? "" : giaKey}
        onChange={(e) => {
          const [min, max] = e.target.value.split("|");
          update({ giaMin: min ?? "", giaMax: max ?? "" });
        }}
        className={selectCls}
      >
        <option value="">Khoảng giá</option>
        {GIA_OPTIONS.map((o) => (
          <option key={o.label} value={`${o.min}|${o.max}`}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        value={dtKey === "|" ? "" : dtKey}
        onChange={(e) => {
          const [min, max] = e.target.value.split("|");
          update({ dtMin: min ?? "", dtMax: max ?? "" });
        }}
        className={selectCls}
      >
        <option value="">Diện tích</option>
        {DT_OPTIONS.map((o) => (
          <option key={o.label} value={`${o.min}|${o.max}`}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        value={tang}
        onChange={(e) => update({ tang: e.target.value })}
        className={selectCls}
      >
        <option value="">Số tầng</option>
        {TANG_OPTIONS.map((o) => (
          <option key={o} value={o}>
            {o === "5" ? "5+ tầng" : `${o} tầng`}
          </option>
        ))}
      </select>
    </div>
  );
}
