import { createClient } from "@/lib/supabase/server";

// Cache ngan de tranh query lap tren nhieu component trong cung 1 request/khoang thoi gian
export const revalidate = 60;

export type QuanStat = { quan: string; count: number; variants: string[] };

// Dem tong so can that (chi tinh tin da duyet)
export async function getTongSoCan(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("web_posts")
    .select("*", { count: "exact", head: true })
    .eq("trang_thai", "duyet");
  if (error) {
    console.error("getTongSoCan error:", error.message);
    return 0;
  }
  return count ?? 0;
}

// Viet hoa chu cai dau moi tu (giu nguyen chu cai co dau)
function capWords(s: string): string {
  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toLocaleUpperCase("vi-VN") + w.slice(1))
    .join(" ");
}

// Chuan hoa ten quan de gom cac cach ghi khac nhau ve 1 chuan.
// Vi du: "Quận Binh Thanh" -> "Binh Thanh"; "Q1"/"Q.1" -> "Quận 1".
// Tra ve "" neu la gia tri rac (chi co moi chu "Quận" hoac rong).
export function normalizeQuan(raw: string | null | undefined): string {
  let s = (raw ?? "").trim().replace(/\s+/g, " ");
  if (!s) return "";
  s = s.replace(/^Q[\.\s]*([0-9]{1,2})$/i, "Quận $1");
  const soMatch = s.match(/^Quận\s*([0-9]{1,2})$/i);
  if (soMatch) return "Quận " + soMatch[1];
  const chuMatch = s.match(/^Quận\s+(\D.*)$/i);
  if (chuMatch) {
    const rest = chuMatch[1].trim();
    if (rest) return capWords(rest);
  }
  if (/^Quận$/i.test(s)) return "";
  return capWords(s);
}

// Lay danh sach quan + so luong that, gom cac cach ghi trung ve 1 chuan,
// sap xep giam dan theo so can. Moi muc kem "variants" = tat ca cach ghi tho trong DB
// de trang tin-dang loc dung tat ca cac tin (khong sot tin ghi khac cach).
// Doc TAT CA cac dong (vuot qua gioi han mac dinh 1000 cua PostgREST) bang phan trang theo range.
export async function getDanhSachQuan(): Promise<QuanStat[]> {
  const supabase = await createClient();
  const counts = new Map<string, number>();
  const variantSet = new Map<string, Set<string>>();
  const CHUNK = 1000;
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("web_posts")
      .select("quan")
      .eq("trang_thai", "duyet")
      .range(from, from + CHUNK - 1);
    if (error) {
      console.error("getDanhSachQuan error:", error.message);
      break;
    }
    const rows = (data ?? []) as { quan: string | null }[];
    for (const row of rows) {
      const raw = (row.quan ?? "").trim();
      const chuan = normalizeQuan(raw);
      if (!chuan) continue;
      counts.set(chuan, (counts.get(chuan) ?? 0) + 1);
      if (!variantSet.has(chuan)) variantSet.set(chuan, new Set());
      if (raw) variantSet.get(chuan)!.add(raw);
    }
    if (rows.length < CHUNK) break;
    from += CHUNK;
  }
  return Array.from(counts.entries())
    .map(([quan, count]) => ({
      quan,
      count,
      variants: Array.from(variantSet.get(quan) ?? [quan]),
    }))
    .sort((a, b) => b.count - a.count);
}

// Dinh dang so kieu Viet Nam (3543 -> "3.543")
export function formatSoCan(n: number): string {
  return n.toLocaleString("vi-VN");
}
