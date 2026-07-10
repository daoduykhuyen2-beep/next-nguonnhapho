import { createClient } from "@/lib/supabase/server";

// Cache ngan de tranh query lap tren nhieu component trong cung 1 request/khoang thoi gian
export const revalidate = 60;

export type QuanStat = { quan: string; so_can: number };

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

// Lay danh sach quan + so luong that, sap xep giam dan theo so can
export async function getDanhSachQuan(): Promise<QuanStat[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("web_posts")
    .select("quan")
    .eq("trang_thai", "duyet");
  if (error) {
    console.error("getDanhSachQuan error:", error.message);
    return [];
  }
  const map = new Map<string, number>();
  for (const row of (data ?? []) as { quan: string | null }[]) {
    const q = (row.quan ?? "").trim();
    if (!q) continue;
    map.set(q, (map.get(q) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([quan, so_can]) => ({ quan, so_can }))
    .sort((a, b) => b.so_can - a.so_can);
}

// Dinh dang so kieu Viet Nam (3543 -> "3.543")
export function formatSoCan(n: number): string {
  return n.toLocaleString("vi-VN");
}
