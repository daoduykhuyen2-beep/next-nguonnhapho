"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "daoduykhuyen2@gmail.com";

export type PlanState = { error?: string; success?: boolean };

function toIntOrNull(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (s === "") return null;
  const n = Math.round(Number(s.replace(/[^0-9]/g, "")));
  return Number.isFinite(n) ? n : null;
}

// Luu chinh sua gia / thong tin 1 goi (chi admin).
export async function adminSavePlanOverride(
  _prev: PlanState,
  formData: FormData
): Promise<PlanState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Ban can dang nhap." };

  const { data: prof } = await supabase
    .from("profiles")
    .select("is_admin, role")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin =
    user.email === ADMIN_EMAIL || prof?.is_admin === true || prof?.role === "admin";
  if (!isAdmin) return { error: "Chi admin duoc chinh sua goi." };

  const code = String(formData.get("code") || "").trim();
  if (!code) return { error: "Thieu ma goi." };

  const promoUntilRaw = String(formData.get("promo_until") || "").trim();

  const payload = {
    code,
    name: String(formData.get("name") || "").trim() || null,
    price: toIntOrNull(formData.get("price")),
    market_price: toIntOrNull(formData.get("market_price")),
    promo_price: toIntOrNull(formData.get("promo_price")),
    promo_label: String(formData.get("promo_label") || "").trim() || null,
    promo_until: promoUntilRaw || null,
    badge: String(formData.get("badge") || "").trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("plan_overrides")
    .upsert(payload, { onConflict: "code" });
  if (error) {
    console.error("adminSavePlanOverride error:", error.message);
    return { error: "Khong the luu goi. Vui long thu lai." };
  }

  revalidatePath("/admin/nap-tien");
  revalidatePath("/goi-thanh-vien");
  return { success: true };
}
