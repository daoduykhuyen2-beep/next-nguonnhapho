import { createClient } from "@/lib/supabase/server";
import { PLANS, type Plan } from "@/lib/plans";

// Merge cac chinh sua gia/thong tin goi tu bang plan_overrides (admin sua trong app)
// vao danh sach PLANS goc. Chi ghi de nhung truong admin da nhap.
export async function getPlansMerged(): Promise<Plan[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("plan_overrides")
      .select("code, name, price, market_price, promo_price, promo_label, promo_until, badge");
    const map = new Map<string, Record<string, unknown>>();
    (data || []).forEach((o) => map.set(String(o.code), o as Record<string, unknown>));

    return PLANS.map((p) => {
      const o = map.get(p.code);
      if (!o) return p;
      const merged: Plan = { ...p };
      if (o.name != null && String(o.name).trim() !== "") merged.name = String(o.name);
      if (o.price != null) merged.price = Number(o.price);
      if (o.market_price != null) merged.marketPrice = Number(o.market_price);
      if (o.badge != null && String(o.badge).trim() !== "") merged.badge = String(o.badge);
      if (o.promo_price != null) merged.promoPrice = Number(o.promo_price);
      if (o.promo_label != null && String(o.promo_label).trim() !== "")
        merged.promoLabel = String(o.promo_label);
      if (o.promo_until != null && String(o.promo_until).trim() !== "")
        merged.promoUntil = String(o.promo_until);
      return merged;
    });
  } catch {
    return PLANS;
  }
}

// Lay 1 goi da merge theo code (dung cho createOrder de tinh dung gia hieu luc).
export async function getPlanMerged(code: string): Promise<Plan | undefined> {
  const all = await getPlansMerged();
  return all.find((p) => p.code.toUpperCase() === code.toUpperCase());
}
