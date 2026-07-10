"use client";
import { useState } from "react";

export default function LoanCalculator({ giaTy }: { giaTy: number }) {
  const [tyLe, setTyLe] = useState(60);
  const [laiSuat, setLaiSuat] = useState(8.5);
  const [namVay, setNamVay] = useState(20);

  const soVay = (giaTy * tyLe) / 100; // ty
  const vonTuCo = giaTy - soVay; // ty
  const goc = (soVay * 1000) / (namVay * 12); // trieu/thang
  const laiThangDau = (soVay * 1000 * (laiSuat / 100)) / 12; // trieu
  const traThangDau = Math.round(goc + laiThangDau);

  const box = "rounded-lg border px-3 py-2 w-full";

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        <label className="text-sm">
          Tỷ lệ vay (%)
          <input type="number" className={box} value={tyLe} onChange={(e) => setTyLe(+e.target.value)} />
        </label>
        <label className="text-sm">
          Lãi suất (%/năm)
          <input type="number" className={box} value={laiSuat} onChange={(e) => setLaiSuat(+e.target.value)} />
        </label>
        <label className="text-sm">
          Thời hạn (năm)
          <input type="number" className={box} value={namVay} onChange={(e) => setNamVay(+e.target.value)} />
        </label>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-gray-50 p-4 text-center">
        <div>
          <p className="text-xs uppercase text-gray-500">Số tiền vay</p>
          <p className="font-bold text-brand">{soVay.toLocaleString("vi-VN")} tỷ</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500">Trả tháng đầu</p>
          <p className="font-bold text-brand">≈ {traThangDau.toLocaleString("vi-VN")} triệu</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500">Vốn tự có cần</p>
          <p className="font-bold text-brand">{vonTuCo.toLocaleString("vi-VN")} tỷ</p>
        </div>
      </div>
    </div>
  );
}
