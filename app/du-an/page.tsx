import type { Metadata } from "next";
import DuAnClient from "./DuAnClient";
import { DU_AN_ITEMS, type DuAnItem } from "@/lib/duAnData";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dự án & Chung cư đang bán | Nguồn Nhà Phố HCM",
  description:
    "Danh sách dự án và căn hộ chung cư đang bán tại TP.HCM và khu vực lân cận — tìm kiếm theo tên dự án, khu vực và mức giá.",
};

// Trang doc truc tiep tu database: moi tin loai "Can ho" (can_ho) hoac
// "Du an" (du_an) da duyet se tu dong hien thi cong khai tai day.
export const revalidate = 60;

// Tach so ty tu chuoi gia ("8.8 ty", "28.800.000.000 VND", ...)
function parseGiaTy(gia: string | null): number {
  if (!gia) return 0;
  const s = String(gia).trim().toLowerCase();
  if (s.includes("thỏa thuận")) return 0;
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
      loai: p.loai === "du_an" ? "Dự án" : "Chung cư",
      htrang: "Mới đăng",
      duAn: p.title || "",
      diaChi: p.title || "",
      duong: p.duong || "",
      quan: p.quan || "",
      tinh: p.phuong || "",
      dt,
      tang: parseNum(p.so_tang),
      gia,
      donGia: dt > 0 && gia > 0 ? Math.round((gia * 1000) / dt) : 0,
      phapLy: "Đang cập nhật",
      hopDong: "",
      dacDiem: p.mota || "",
      ngayCN: p.created_at ? new Date(p.created_at).toLocaleDateString("vi-VN") : "",
      anh: pickCover(p.anh),
    };
  });
}

export default async function DuAnPage() {
  const tinThat = await getPostItems();
  const items = [...tinThat, ...DU_AN_ITEMS];
  return <DuAnClient items={items} />;
}
