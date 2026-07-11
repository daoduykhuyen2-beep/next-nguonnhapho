"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const KHU_VUC = [
  "Quận 1",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 10",
  "Bình Thạnh",
  "Phú Nhuận",
  "Tân Bình",
  "Gò Vấp",
  "Bình Chánh",
];

// Khoảng giá (tỷ) -> giaMin/giaMax
const GIA = [
  { label: "Mọi mức giá", min: "", max: "" },
  { label: "Dưới 5 tỷ", min: "", max: "5" },
  { label: "5 - 10 tỷ", min: "5", max: "10" },
  { label: "10 - 30 tỷ", min: "10", max: "30" },
  { label: "30 - 100 tỷ", min: "30", max: "100" },
  { label: "Trên 100 tỷ", min: "100", max: "" },
];

// Diện tích (m²) -> dtMin/dtMax
const DT = [
  { label: "Mọi diện tích", min: "", max: "" },
  { label: "Dưới 50 m²", min: "", max: "50" },
  { label: "50 - 100 m²", min: "50", max: "100" },
  { label: "100 - 200 m²", min: "100", max: "200" },
  { label: "Trên 200 m²", min: "200", max: "" },
];

export default function HeroSearch() {
  const router = useRouter();
  const [loai, setLoai] = useState("");
  const [q, setQ] = useState("");
  const [quan, setQuan] = useState("");
  const [gia, setGia] = useState(0);
  const [dt, setDt] = useState(0);
  const [tang, setTang] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (loai) p.set("loai", loai);
    if (quan) p.set("quan", quan);
    if (GIA[gia].min) p.set("giaMin", GIA[gia].min);
    if (GIA[gia].max) p.set("giaMax", GIA[gia].max);
    if (DT[dt].min) p.set("dtMin", DT[dt].min);
    if (DT[dt].max) p.set("dtMax", DT[dt].max);
    if (tang) p.set("tang", tang);
    const qs = p.toString();
    router.push("/tin-dang" + (qs ? "?" + qs : ""));
  }

  const tab = (val: string, label: string) => (
    <button
      type="button"
      onClick={() => setLoai(val)}
      className={
        "px-4 py-2 text-sm font-semibold transition border-b-2 " +
        (loai === val
          ? "border-brand text-brand"
          : "border-transparent text-gray-500 hover:text-gray-800")
      }
    >
      {label}
    </button>
  );

  const selCls =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900";

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:p-4"
    >
      <div className="mb-2 flex gap-1 border-b border-gray-200">
        {tab("", "Mua bán")}
        {tab("thue", "Cho thuê")}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nhập tên đường, phường, từ khoá… VD: Nguyễn Đình Chiểu"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900"
        />
        <button type="submit" className="np-btn px-6 py-2.5 text-sm font-semibold">
          Tìm kiếm
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <select value={quan} onChange={(e) => setQuan(e.target.value)} className={selCls}>
          <option value="">Tất cả khu vực</option>
          {KHU_VUC.map((kv) => (
            <option key={kv} value={kv}>
              {kv}
            </option>
          ))}
        </select>

        <select value={gia} onChange={(e) => setGia(Number(e.target.value))} className={selCls}>
          {GIA.map((g, i) => (
            <option key={i} value={i}>
              {g.label}
            </option>
          ))}
        </select>

        <select value={dt} onChange={(e) => setDt(Number(e.target.value))} className={selCls}>
          {DT.map((d, i) => (
            <option key={i} value={i}>
              {d.label}
            </option>
          ))}
        </select>

        <select value={tang} onChange={(e) => setTang(e.target.value)} className={selCls}>
          <option value="">Số tầng</option>
          <option value="1">1 tầng</option>
          <option value="2">2 tầng</option>
          <option value="3">3 tầng</option>
          <option value="4">4 tầng</option>
          <option value="5">5 tầng trở lên</option>
        </select>
      </div>
    </form>
  );
}
