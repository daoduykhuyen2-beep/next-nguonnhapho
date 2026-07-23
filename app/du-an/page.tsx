import type { Metadata } from "next";
import DuAnClient from "./DuAnClient";
import { type DuAnItem } from "@/lib/duAnData";
import duAnHcm from "@/lib/duAnHcm.json";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Nh\u00e0 ph\u1ed1, C\u0103n h\u1ed9 & D\u1ef1 \u00e1n TP.HCM \u0111ang b\u00e1n | Ngu\u1ed3n Nh\u00e0 Ph\u1ed1 HCM",
  description:
    "Danh s\u00e1ch nh\u00e0 ph\u1ed1, c\u0103n h\u1ed9 chung c\u01b0 v\u00e0 d\u1ef1 \u00e1n \u0111ang b\u00e1n t\u1ea1i TP.HCM \u2014 \u0111\u1ea7y \u0111\u1ee7 di\u1ec7n t\u00edch, chi\u1ec1u ngang, chi\u1ec1u d\u00e0i, gi\u00e1 v\u00e0 ph\u00e1p l\u00fd.",
};

export const revalidate = 60;

// Du lieu tinh: toan bo tin BDS TP.HCM tu file JSON.
const STATIC_ITEMS = duAnHcm as unknown as DuAnItem[];

// Tach so ty tu chuoi gia ("8.8 ty", "28.800.000.000 VND", ...)
function parseGiaTy(gia: string | null): number {
  if (!gia) return 0;
  const s = String(gia).trim().toLowerCase();
  if (s.includes("th\u1ecfa thu\u1eadn")) return 0;
  const mTy = s.match(/([\d.,]+)\s*t\u1ef7/);
  if (mTy) return parseFloat(mTy[1].replace(/\./g, "").replace(",", ".")) || 0;
  const digits = s.replace(/[^0-9]/g, "");
  if (digits.length >= 9) return Math.round((parseInt(digits, 10) / 1e9) * 100) / 100;
  const n = parseFloat(s.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function parseNum(v: string | null): number {
  if (!v) return 0;
  const m = String(v).replace(/\./g, "").replace(",", ".").match(/[\d.]+/);
  return m ? parseFloat(m[0]) || 0 : 0;
}

// Lay anh dau tien tu truong anh (JSON array / object imgs / chuoi)
function pickCover(x: any): string | undefined {
  if (!x) return undefined;
  let v: any = x;
  if (typeof v === "string") {
    try { v = JSON.parse(v); } catch { return v || undefined; }
  }
  if (Array.isArray(v)) return v[0] || undefined;
  if (typeof v === "object") {
    if (Array.isArray(v.imgs)) return v.imgs[0] || undefined;
    if (v.tin) return v.tin;
  }
  return undefined;
}

async function getPostItems(): Promise<DuAnItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("web_posts")
    .select("*")
    .eq("trang_thai", "duyet")
    .in("loai", ["can_ho", "du_an"])
    .order("created_at", { ascending: false })
    .limit(500);
  if (error || !data) return [];
  return data.map((p: any): DuAnItem => {
    const gia = parseGiaTy(p.gia);
    const dt = parseNum(p.dien_tich);
    return {
      ma: p.id,
      loai: p.loai === "du_an" ? "D\u1ef1 \u00e1n" : "Chung c\u01b0",
      htrang: "M\u1edbi \u0111\u0103ng",
      duAn: p.title || "",
      diaChi: p.title || "",
      duong: p.duong || "",
      quan: p.quan || "",
      tinh: p.phuong || "",
      dt,
      tang: parseNum(p.so_tang),
      gia,
      donGia: dt > 0 && gia > 0 ? Math.round((gia * 1000) / dt) : 0,
      phapLy: "\u0110ang c\u1eadp nh\u1eadt",
      hopDong: "",
      dacDiem: p.mota || "",
      ngayCN: p.created_at ? new Date(p.created_at).toLocaleDateString("vi-VN") : "",
      anh: pickCover(p.anh),
    };
  });
}

export default async function DuAnPage() {
  const tinThat = await getPostItems();
  const items = [...tinThat, ...STATIC_ITEMS];
  return <DuAnClient items={items} />;
}
