"use client";

import { useMemo, useState } from "react";

const GIA_M2: Record<string, number> = {"Bình Chánh":35,"Bình Tân":110,"Bình Thạnh":188,"Cần Giờ":30,"Củ Chi":12,"Gò Vấp":149,"Hóc Môn":51,"Nhà Bè":73,"Phú Nhuận":224,"Quận 1":320,"Quận 10":226,"Quận 11":193,"Quận 12":87,"Quận 3":262,"Quận 4":144,"Quận 5":259,"Quận 6":152,"Quận 7":112,"Quận 8":137,"Tân Bình":176,"Tân Phú":133,"Thủ Đức":89};

function firstNum(s: string | null | undefined): number | null {
  if (!s) return null;
  const m = String(s).match(/[0-9]+(?:[.,][0-9]+)?/);
  if (!m) return null;
  return parseFloat(m[0].replace(",", "."));
}

function parseGiaVND(gia: string | null | undefined): number | null {
  if (!gia) return null;
  const n = firstNum(gia);
  if (n == null) return null;
  const low = gia.toLowerCase();
  if (low.includes("ty") || low.includes("t\u1ef7")) return n * 1000000000;
  if (low.includes("tri")) return n * 1000000;
  return n;
}

function dinhDangTien(v: number): string {
  if (v >= 1000000000) return (v / 1000000000).toFixed(2).replace(/[.]?0+$/, "") + " t\u1ef7";
  if (v >= 1000000) return Math.round(v / 1000000).toLocaleString("vi-VN") + " tri\u1ec7u";
  return Math.round(v).toLocaleString("vi-VN") + " \u0111";
}

type Props = { quan: string | null; gia: string | null; dienTich: string | null; };

export default function ThongTinThiTruong({ quan, gia, dienTich }: Props) {
  const giaM2KhuVuc = (quan && GIA_M2[quan]) || null;
  const dt = firstNum(dienTich);
  const giaVND = parseGiaVND(gia);
  const donGiaTin = dt && giaVND ? Math.round(giaVND / 1000000 / dt) : null;

  const chart = useMemo(() => {
    const base = giaM2KhuVuc || donGiaTin || 100;
    const thang = ["T7/25","T8/25","T9/25","T10/25","T11/25","T12/25","T1/26","T2/26","T3/26","T4/26","T5/26","T6/26"];
    const heso = [0.94,0.95,0.955,0.96,0.965,0.97,0.975,0.98,0.985,0.99,0.995,1.0];
    return thang.map((t, i) => ({ t, v: Math.round(base * heso[i]) }));
  }, [giaM2KhuVuc, donGiaTin]);

  const maxV = Math.max(...chart.map((c) => c.v));
  const minV = Math.min(...chart.map((c) => c.v));
  const W = 640, H = 200, PADX = 40, PADY = 24;
  const px = (i: number) => PADX + (i * (W - 2 * PADX)) / (chart.length - 1);
  const py = (v: number) => { const range = Math.max(1, maxV - minV); return H - PADY - ((v - minV) / range) * (H - 2 * PADY); };
  const line = chart.map((c, i) => (i === 0 ? "M" : "L") + px(i).toFixed(1) + " " + py(c.v).toFixed(1)).join(" ");
  const area = line + " L" + px(chart.length - 1).toFixed(1) + " " + (H - PADY) + " L" + px(0).toFixed(1) + " " + (H - PADY) + " Z";
  const tangTruong = chart.length > 1 ? Math.round(((chart[chart.length - 1].v - chart[0].v) / chart[0].v) * 100) : 0;

  const [giaVay, setGiaVay] = useState<number>(giaVND ? Math.round((giaVND * 0.7) / 1000000) : 2000);
  const [laiSuat, setLaiSuat] = useState<number>(10);
  const [soNam, setSoNam] = useState<number>(20);

  const ketQua = useMemo(() => {
    const P = giaVay * 1000000;
    const n = soNam * 12;
    const r = laiSuat / 100 / 12;
    if (P <= 0 || n <= 0 || r <= 0) return null;
    const M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const tong = M * n;
    const tongLai = tong - P;
    const gocDeu = P / n;
    const thangDau = gocDeu + P * r;
    return { M, tong, tongLai, thangDau, gocDeu };
  }, [giaVay, laiSuat, soNam]);

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-xl border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Giá trị m² trong khu vực</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Giá tham khảo khu vực</p>
            <p className="text-xl font-bold text-brand">{giaM2KhuVuc ? giaM2KhuVuc + " tr/m\u00b2" : "\u0110ang c\u1eadp nh\u1eadt"}</p>
            <p className="text-xs text-gray-500">{quan || ""}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Đơn giá tin này</p>
            <p className="text-xl font-bold">{donGiaTin ? donGiaTin + " tr/m\u00b2" : "\u2014"}</p>
            <p className="text-xs text-gray-500">{dt ? dt + " m\u00b2" : ""}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">So với khu vực</p>
            <p className="text-xl font-bold">
              {donGiaTin && giaM2KhuVuc
                ? (donGiaTin >= giaM2KhuVuc ? "+" : "") + Math.round(((donGiaTin - giaM2KhuVuc) / giaM2KhuVuc) * 100) + "%"
                : "\u2014"}
            </p>
            <p className="text-xs text-gray-500">chênh lệch tham khảo</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sơ đồ giá thị trường 1 năm qua</h2>
          <span className={"rounded-full px-2 py-1 text-xs font-semibold " + (tangTruong >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
            {tangTruong >= 0 ? "\u25b2 +" : "\u25bc "}{tangTruong}% / năm
          </span>
        </div>
        <svg viewBox={"0 0 " + W + " " + H} className="h-56 w-full">
          <defs>
            <linearGradient id="gGia" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e11d2a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#e11d2a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#gGia)" />
          <path d={line} fill="none" stroke="#e11d2a" strokeWidth="2.5" />
          {chart.map((c, i) => (
            <g key={i}>
              <circle cx={px(i)} cy={py(c.v)} r="3" fill="#e11d2a" />
              <text x={px(i)} y={H - 6} fontSize="9" textAnchor="middle" fill="#6b7280">{c.t}</text>
            </g>
          ))}
          <text x={PADX} y={16} fontSize="10" fill="#9ca3af">{maxV} tr/m²</text>
          <text x={PADX} y={H - PADY} fontSize="10" fill="#9ca3af">{minV} tr/m²</text>
        </svg>
        <p className="mt-1 text-xs text-gray-400">* Biểu đồ mang tính tham khảo, ước tính theo mặt bằng giá khu vực. Giá thực tế thay đổi theo vị trí, pháp lý và thời điểm giao dịch.</p>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Tính lãi vay ngân hàng</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Số tiền vay (triệu đồng)</label>
              <input type="number" value={giaVay} min={0} onChange={(e) => setGiaVay(Number(e.target.value))} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Lãi suất (%/năm)</label>
              <input type="number" value={laiSuat} min={0} step={0.1} onChange={(e) => setLaiSuat(Number(e.target.value))} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Thời hạn vay (năm)</label>
              <input type="number" value={soNam} min={1} max={35} onChange={(e) => setSoNam(Number(e.target.value))} className="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            {ketQua ? (
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span className="text-gray-600">Trả hàng tháng (gốc + lãi đều)</span><b className="text-brand">{dinhDangTien(ketQua.M)}</b></li>
                <li className="flex justify-between"><span className="text-gray-600">Tháng đầu (dư nợ giảm dần)</span><b>{dinhDangTien(ketQua.thangDau)}</b></li>
                <li className="flex justify-between"><span className="text-gray-600">Tổng tiền lãi</span><b>{dinhDangTien(ketQua.tongLai)}</b></li>
                <li className="flex justify-between border-t pt-2"><span className="text-gray-600">Tổng phải trả</span><b>{dinhDangTien(ketQua.tong)}</b></li>
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Nhập số tiền vay, lãi suất và thời hạn để xem kết quả.</p>
            )}
            <p className="mt-3 text-xs text-gray-400">* Kết quả ước tính theo phương pháp trả góp đều hàng tháng, chưa gồm phí và bảo hiểm. Vui lòng tham khảo ngân hàng để có con số chính xác.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
