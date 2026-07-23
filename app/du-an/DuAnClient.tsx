"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type DuAnItem } from "@/lib/duAnData";
import { pickStockImageByType } from "@/lib/stockImages";

const GIA_RANGES = [
  { label: "Tất cả mức giá", min: 0, max: Infinity },
  { label: "Dưới 5 tỷ", min: 0, max: 5 },
  { label: "5 - 10 tỷ", min: 5, max: 10 },
  { label: "10 - 20 tỷ", min: 10, max: 20 },
  { label: "Trên 20 tỷ", min: 20, max: Infinity },
];

function formatGia(gia: number) {
  if (!gia) return "Thỏa thuận";
  return gia + " tỷ";
}

function DuAnCard({ item }: { item: DuAnItem }) {
  const tenChinh = item.duAn || (item.loai === "Dự án" ? "Dự án bất động sản" : "Căn hộ chung cư");
  // An so can / ten toa (item.diaChi) - chi hien duong, quan, tinh de khong lo can cu the.
  const diaChiDayDu = [item.duong, item.quan, item.tinh]
    .filter(Boolean)
    .join(", ");
  const dacDiem = item.dacDiem ? item.dacDiem.split(",").map((s) => s.trim()).filter(Boolean) : [];
  // Anh that nguoi dung upload (neu co); neu khong thi anh minh hoa theo loai (du an / can ho).
  const anh = item.anh || pickStockImageByType(item.ma, item.loai);
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        <span
          className={
            "absolute left-2 top-2 z-10 rounded-full px-2.5 py-0.5 text-xs font-semibold " +
            (item.loai === "Dự án"
              ? "bg-amber-100 text-amber-700"
              : "bg-blue-100 text-blue-700")
          }
        >
          {item.loai}
        </span>
        <span className="absolute right-2 top-2 z-10 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
          {item.htrang}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={anh} alt={tenChinh} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col p-5">
        <h3 className="text-base font-semibold text-gray-900">{tenChinh}</h3>
        <p className="mt-1 text-sm text-gray-500">{diaChiDayDu}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          <span className="font-bold text-brand">{formatGia(item.gia)}</span>
          {item.dt ? <span>{item.dt} m²</span> : null}
          {item.donGia ? <span>{item.donGia} tr/m²</span> : null}
          {item.tang ? <span>{item.tang} tầng</span> : null}
        </div>
        <div className="mt-3 border-t pt-3 text-xs text-gray-500">
          <span className="font-medium text-gray-700">Pháp lý:</span> {item.phapLy}
        </div>
        {dacDiem.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {dacDiem.slice(0, 4).map((d, idx) => (
              <span key={idx} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {d}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DuAnClient({ items }: { items: DuAnItem[] }) {
  const [tuKhoa, setTuKhoa] = useState("");
  const [loai, setLoai] = useState("Tất cả");
  const [quan, setQuan] = useState("");
  const [giaIdx, setGiaIdx] = useState(0);

  const quanList = useMemo(
    () =>
      Array.from(new Set(items.map((i) => i.quan).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b, "vi")
      ),
    [items]
  );

  const ketQua = useMemo(() => {
    const kw = tuKhoa.trim().toLowerCase();
    const range = GIA_RANGES[giaIdx];
    return items.filter((it) => {
      if (loai !== "Tất cả" && it.loai !== loai) return false;
      if (quan && it.quan !== quan) return false;
      if (it.gia < range.min || it.gia > range.max) return false;
      if (kw) {
        const hay = (
          it.duAn + " " + it.diaChi + " " + it.duong + " " + it.quan + " " + it.dacDiem
        ).toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [items, tuKhoa, loai, quan, giaIdx]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Dự án &amp; Chung cư</h1>
      <p className="mt-1 text-sm text-gray-500">
        Danh sách {items.length} căn hộ chung cư và dự án đang bán — tìm theo tên dự án,
        khu vực và mức giá. Tin mới đăng loại Căn hộ/Dự án sẽ tự động hiển thị tại đây.
      </p>

      <div className="mt-6 rounded-2xl border bg-gray-50 p-4">
        <input
          type="text"
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          placeholder="Tìm theo tên dự án, đường, quận, đặc điểm..."
          className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {["Tất cả", "Chung cư", "Dự án"].map((l) => (
            <button
              key={l}
              onClick={() => setLoai(l)}
              className={
                "rounded-full px-4 py-1.5 text-sm font-medium transition " +
                (loai === l
                  ? "bg-brand text-white"
                  : "bg-white text-gray-700 border hover:bg-gray-100")
              }
            >
              {l}
            </button>
          ))}
          <select
            value={quan}
            onChange={(e) => setQuan(e.target.value)}
            className="rounded-full border bg-white px-4 py-1.5 text-sm text-gray-700"
          >
            <option value="">Tất cả khu vực</option>
            {quanList.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
          <select
            value={giaIdx}
            onChange={(e) => setGiaIdx(Number(e.target.value))}
            className="rounded-full border bg-white px-4 py-1.5 text-sm text-gray-700"
          >
            {GIA_RANGES.map((g, idx) => (
              <option key={idx} value={idx}>
                {g.label}
              </option>
            ))}
          </select>
          {(tuKhoa || loai !== "Tất cả" || quan || giaIdx !== 0) && (
            <button
              onClick={() => {
                setTuKhoa("");
                setLoai("Tất cả");
                setQuan("");
                setGiaIdx(0);
              }}
              className="text-sm text-brand underline"
            >
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Tìm thấy <span className="font-semibold text-gray-800">{ketQua.length}</span> kết quả
      </p>

      {ketQua.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed p-10 text-center text-gray-500">
          Không tìm thấy tin phù hợp. Thử bỏ bớt bộ lọc hoặc từ khóa khác.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ketQua.map((it) => (
            <DuAnCard key={it.ma} item={it} />
          ))}
        </div>
      )}

      <div className="mt-10 rounded-2xl bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-600">
          Cần tư vấn thêm về dự án hoặc căn hộ? Liên hệ Nguồn Nhà Phố HCM để được hỗ trợ.
        </p>
        <Link
          href="/tin-dang"
          className="mt-3 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white"
        >
          Xem tất cả nhà đang bán
        </Link>
      </div>
    </main>
  );
}
