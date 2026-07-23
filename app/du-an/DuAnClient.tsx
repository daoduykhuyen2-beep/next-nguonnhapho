"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { type DuAnItem } from "@/lib/duAnData";
import { pickStockImageByType } from "@/lib/stockImages";

const PER_PAGE = 24;

const GIA_RANGES = [
  { label: "T\u1ea5t c\u1ea3 m\u1ee9c gi\u00e1", min: 0, max: Infinity },
  { label: "D\u01b0\u1edbi 5 t\u1ef7", min: 0, max: 5 },
  { label: "5 - 10 t\u1ef7", min: 5, max: 10 },
  { label: "10 - 20 t\u1ef7", min: 10, max: 20 },
  { label: "20 - 50 t\u1ef7", min: 20, max: 50 },
  { label: "Tr\u00ean 50 t\u1ef7", min: 50, max: Infinity },
];

// Nhom loai hien thi. "Th\u1ed5 c\u01b0" = nha pho.
const LOAI_TABS = ["T\u1ea5t c\u1ea3", "Nh\u00e0 ph\u1ed1", "Chung c\u01b0", "D\u1ef1 \u00e1n"];
function matchLoai(tab: string, loai: string) {
  if (tab === "T\u1ea5t c\u1ea3") return true;
  if (tab === "Nh\u00e0 ph\u1ed1") return loai === "Th\u1ed5 c\u01b0" || loai === "Nh\u00e0 ph\u1ed1";
  return loai === tab;
}

function formatGia(gia: number) {
  if (!gia) return "Th\u1ecfa thu\u1eadn";
  return gia + " t\u1ef7";
}

// Nhan hien thi theo loai tin.
function loaiLabel(loai: string) {
  if (loai === "Th\u1ed5 c\u01b0") return "Nh\u00e0 ph\u1ed1";
  return loai;
}
function loaiBadgeClass(loai: string) {
  if (loai === "D\u1ef1 \u00e1n") return "bg-amber-100 text-amber-700";
  if (loai === "Chung c\u01b0") return "bg-blue-100 text-blue-700";
  return "bg-emerald-100 text-emerald-700";
}
function tenMacDinh(item: DuAnItem) {
  if (item.duAn) return item.duAn;
  if (item.loai === "D\u1ef1 \u00e1n") return "D\u1ef1 \u00e1n b\u1ea5t \u0111\u1ed9ng s\u1ea3n";
  if (item.loai === "Chung c\u01b0") return "C\u0103n h\u1ed9 chung c\u01b0";
  return "Nh\u00e0 ph\u1ed1";
}

function DuAnCard({ item }: { item: DuAnItem }) {
  const tenChinh = tenMacDinh(item);
  // An so can / ten toa (item.diaChi) - chi hien duong, quan, tinh.
  const diaChiDayDu = [item.duong, item.quan, item.tinh].filter(Boolean).join(", ");
  const dacDiem = item.dacDiem ? item.dacDiem.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const anh = item.anh || pickStockImageByType(item.ma, item.loai);
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        <span
          className={
            "absolute left-2 top-2 z-10 rounded-full px-2.5 py-0.5 text-xs font-semibold " +
            loaiBadgeClass(item.loai)
          }
        >
          {loaiLabel(item.loai)}
        </span>
        <span className="absolute right-2 top-2 z-10 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
          {item.htrang}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={anh} alt={tenChinh} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col p-5">
        <h3 className="text-base font-semibold text-gray-900">{tenChinh}</h3>
        <p className="mt-1 text-sm text-gray-500">{diaChiDayDu}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          <span className="font-bold text-brand">{formatGia(item.gia)}</span>
          {item.dt ? <span>{item.dt} m\u00b2</span> : null}
          {item.donGia ? <span>{item.donGia} tr/m\u00b2</span> : null}
          {item.tang ? <span>{item.tang} t\u1ea7ng</span> : null}
        </div>
        {(item.ngang || item.dai) && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            {item.ngang ? <span>Ngang: <span className="font-medium text-gray-800">{item.ngang} m</span></span> : null}
            {item.dai ? <span>D\u00e0i: <span className="font-medium text-gray-800">{item.dai} m</span></span> : null}
          </div>
        )}
        <div className="mt-3 border-t pt-3 text-xs text-gray-500">
          <span className="font-medium text-gray-700">Ph\u00e1p l\u00fd:</span> {item.phapLy}
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
  const [loai, setLoai] = useState("T\u1ea5t c\u1ea3");
  const [quan, setQuan] = useState("");
  const [giaIdx, setGiaIdx] = useState(0);
  const [trang, setTrang] = useState(1);

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
      if (!matchLoai(loai, it.loai)) return false;
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

  // Reset ve trang 1 moi khi doi bo loc.
  useEffect(() => {
    setTrang(1);
  }, [tuKhoa, loai, quan, giaIdx]);

  const tongTrang = Math.max(1, Math.ceil(ketQua.length / PER_PAGE));
  const trangHienTai = Math.min(trang, tongTrang);
  const hienThi = ketQua.slice((trangHienTai - 1) * PER_PAGE, trangHienTai * PER_PAGE);

  // Danh sach so trang gon (toi da ~7 nut).
  const soTrang = useMemo(() => {
    const arr: number[] = [];
    const start = Math.max(1, trangHienTai - 2);
    const end = Math.min(tongTrang, start + 4);
    for (let i = Math.max(1, end - 4); i <= end; i++) arr.push(i);
    return arr;
  }, [trangHienTai, tongTrang]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Nh\u00e0 ph\u1ed1, C\u0103n h\u1ed9 &amp; D\u1ef1 \u00e1n TP.HCM</h1>
      <p className="mt-1 text-sm text-gray-500">
        Danh s\u00e1ch {items.length.toLocaleString("vi-VN")} tin nh\u00e0 ph\u1ed1, c\u0103n h\u1ed9 chung c\u01b0 v\u00e0 d\u1ef1 \u00e1n \u0111ang b\u00e1n t\u1ea1i TP.HCM \u2014
        \u0111\u1ea7y \u0111\u1ee7 di\u1ec7n t\u00edch, chi\u1ec1u ngang, chi\u1ec1u d\u00e0i, gi\u00e1 v\u00e0 ph\u00e1p l\u00fd. T\u00ecm theo khu v\u1ef1c v\u00e0 m\u1ee9c gi\u00e1.
      </p>

      <div className="mt-6 rounded-2xl border bg-gray-50 p-4">
        <input
          type="text"
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          placeholder="T\u00ecm theo t\u00ean d\u1ef1 \u00e1n, \u0111\u01b0\u1eddng, qu\u1eadn, \u0111\u1eb7c \u0111i\u1ec3m..."
          className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {LOAI_TABS.map((l) => (
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
            <option value="">T\u1ea5t c\u1ea3 khu v\u1ef1c</option>
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
          {(tuKhoa || loai !== "T\u1ea5t c\u1ea3" || quan || giaIdx !== 0) && (
            <button
              onClick={() => {
                setTuKhoa("");
                setLoai("T\u1ea5t c\u1ea3");
                setQuan("");
                setGiaIdx(0);
              }}
              className="text-sm text-brand underline"
            >
              X\u00f3a l\u1ecdc
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        T\u00ecm th\u1ea5y <span className="font-semibold text-gray-800">{ketQua.length.toLocaleString("vi-VN")}</span> k\u1ebft qu\u1ea3
        {tongTrang > 1 ? <> \u2014 trang {trangHienTai}/{tongTrang}</> : null}
      </p>

      {ketQua.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed p-10 text-center text-gray-500">
          Kh\u00f4ng t\u00ecm th\u1ea5y tin ph\u00f9 h\u1ee3p. Th\u1eed b\u1ecf b\u1edbt b\u1ed9 l\u1ecdc ho\u1eb7c t\u1eeb kh\u00f3a kh\u00e1c.
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hienThi.map((it) => (
              <DuAnCard key={it.ma} item={it} />
            ))}
          </div>

          {tongTrang > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setTrang((t) => Math.max(1, t - 1))}
                disabled={trangHienTai === 1}
                className="rounded-lg border bg-white px-3 py-1.5 text-sm text-gray-700 disabled:opacity-40 hover:bg-gray-100"
              >
                Tr\u01b0\u1edbc
              </button>
              {soTrang[0] > 1 && (
                <>
                  <button onClick={() => setTrang(1)} className="rounded-lg border bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">1</button>
                  <span className="px-1 text-gray-400">\u2026</span>
                </>
              )}
              {soTrang.map((p) => (
                <button
                  key={p}
                  onClick={() => setTrang(p)}
                  className={
                    "rounded-lg border px-3 py-1.5 text-sm " +
                    (p === trangHienTai
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-gray-700 hover:bg-gray-100")
                  }
                >
                  {p}
                </button>
              ))}
              {soTrang[soTrang.length - 1] < tongTrang && (
                <>
                  <span className="px-1 text-gray-400">\u2026</span>
                  <button onClick={() => setTrang(tongTrang)} className="rounded-lg border bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">{tongTrang}</button>
                </>
              )}
              <button
                onClick={() => setTrang((t) => Math.min(tongTrang, t + 1))}
                disabled={trangHienTai === tongTrang}
                className="rounded-lg border bg-white px-3 py-1.5 text-sm text-gray-700 disabled:opacity-40 hover:bg-gray-100"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-10 rounded-2xl bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-600">
          C\u1ea7n t\u01b0 v\u1ea5n th\u00eam v\u1ec1 nh\u00e0 ph\u1ed1, d\u1ef1 \u00e1n ho\u1eb7c c\u0103n h\u1ed9? Li\u00ean h\u1ec7 Ngu\u1ed3n Nh\u00e0 Ph\u1ed1 HCM \u0111\u1ec3 \u0111\u01b0\u1ee3c h\u1ed7 tr\u1ee3.
        </p>
        <Link
          href="/tin-dang"
          className="mt-3 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white"
        >
          Xem t\u1ea5t c\u1ea3 nh\u00e0 \u0111ang b\u00e1n
        </Link>
      </div>
    </main>
  );
}
