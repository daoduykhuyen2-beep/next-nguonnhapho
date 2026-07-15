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

export type HomeVideoState = { error?: string; success?: boolean };

export async function saveHomeVideo(
  _prev: HomeVideoState,
  formData: FormData
): Promise<HomeVideoState> {
  const { ok, supabase } = await requireAdmin();
  if (!ok) return { error: "Không có quyền." };

  const tiktok_url = String(formData.get("tiktok_url") || "").trim();
  if (!tiktok_url) return { error: "Vui long dan link TikTok hoac tai video len." };
  const isTiktok = /tiktok\.com/i.test(tiktok_url);
  const isUploaded = /^https?:\/\//i.test(tiktok_url) && /\/storage\/v1\/object\/public\//i.test(tiktok_url);
  if (!isTiktok && !isUploaded)
    return { error: "Nguon video khong hop le. Dan link TikTok hoac tai file video len." };

  const payload = {
    title: String(formData.get("title") || "").trim() || null,
    tiktok_url,
    sort_order: Number(formData.get("sort_order") || 0) || 0,
    active: true,
  };

  const { error } = await supabase.from("home_videos").insert(payload);
  if (error) return { error: error.message };

  revalidatePath("/admin/quan-ly-video");
  revalidatePath("/");
  return { success: true };
}

export async function toggleHomeVideo(formData: FormData): Promise<void> {
  const { ok, supabase } = await requireAdmin();
  if (!ok) return;
  const id = Number(formData.get("id"));
  const active = String(formData.get("active")) === "true";
  await supabase.from("home_videos").update({ active: !active }).eq("id", id);
  revalidatePath("/admin/quan-ly-video");
  revalidatePath("/");
}

export async function deleteHomeVideo(formData: FormData): Promise<void> {
  const { ok, supabase } = await requireAdmin();
  if (!ok) return;
  const id = Number(formData.get("id"));
  await supabase.from("home_videos").delete().eq("id", id);
  revalidatePath("/admin/quan-ly-video");
  revalidatePath("/");
}
