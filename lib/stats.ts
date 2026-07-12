import { createClient } from "@/lib/supabase/server";

// Cache ngan de tranh query lap tren nhieu component trong cung 1 request/khoang thoi gian
export const revalidate = 60;

export type QuanStat = { quan: string; count: number };

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

// Lay danh sach quan + so luong that, sap xep giam dan theo so can.
// Doc TAT CA cac dong (vuot qua gioi han mac dinh 1000 cua PostgREST) bang cach phan trang theo range.
export async function getDanhSachQuan(): Promise<QuanStat[]> {
  const supabase = await createClient();
  const map = new Map<string, number>();
  const CHUNK = 1000;
  let from = 0;
  // Lap cho den khi doc het du lieu
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
      const q = (row.quan ?? "").trim();
      if (!q) continue;
      map.set(q, (map.get(q) ?? 0) + 1);
    }
    if (rows.length < CHUNK) break;
    from += CHUNK;
  }
  return Array.from(map.entries())
    .map(([quan, count]) => ({ quan, count }))
    .sort((a, b) => b.count - a.count);
}

// Dinh dang so kieu Viet Nam (3543 -> "3.543")
export function formatSoCan(n: number): string {
  return n.toLocaleString("vi-VN");
}
