"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "daoduykhuyen2@gmail.com";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, supabase };
  const { data: prof } = await supabase
    .from("profiles")
    .select("is_admin, role")
    .eq("id", user.id)
    .maybeSingle();
  const ok =
    user.email === ADMIN_EMAIL || prof?.is_admin === true || prof?.role === "admin";
  return { ok, supabase };
}

export type BannerState = { error?: string; success?: boolean };

export async function saveBanner(
  _prev: BannerState,
  formData: FormData
): Promise<BannerState> {
  const { ok, supabase } = await requireAdmin();
  if (!ok) return { error: "Không có quyền." };

  const image_url = String(formData.get("image_url") || "").trim();
  if (!image_url) return { error: "Vui lòng nhập link ảnh banner." };

  const payload = {
    title: String(formData.get("title") || "").trim() || null,
    image_url,
    link_url: String(formData.get("link_url") || "").trim() || null,
    sort_order: Number(formData.get("sort_order") || 0) || 0,
    active: true,
  };

  const { error } = await supabase.from("banners").insert(payload);
  if (error) return { error: error.message };

  revalidatePath("/admin/banner");
  revalidatePath("/");
  return { success: true };
}

export async function toggleBanner(formData: FormData): Promise<void> {
  const { ok, supabase } = await requireAdmin();
  if (!ok) return;
  const id = Number(formData.get("id"));
  const active = String(formData.get("active")) === "true";
  await supabase.from("banners").update({ active: !active }).eq("id", id);
  revalidatePath("/admin/banner");
  revalidatePath("/");
}

export async function deleteBanner(formData: FormData): Promise<void> {
  const { ok, supabase } = await requireAdmin();
  if (!ok) return;
  const id = Number(formData.get("id"));
  await supabase.from("banners").delete().eq("id", id);
  revalidatePath("/admin/banner");
  revalidatePath("/");
}
