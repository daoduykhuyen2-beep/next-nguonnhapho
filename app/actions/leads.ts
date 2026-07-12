"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type LeadState = { error?: string; success?: boolean };

// Khach hang quan tam de lai so dien thoai tren tin dang -> luu ve web_post_leads
export async function createLead(
  _prev: LeadState,
  formData: FormData
): Promise<LeadState> {
  const supabase = await createClient();

  const postIdRaw = String(formData.get("post_id") || "").trim();
  const postId = parseInt(postIdRaw, 10);
  if (!postId || Number.isNaN(postId)) return { error: "Tin đăng không hợp lệ." };

  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const note = String(formData.get("note") || "").trim();

  if (!phone) return { error: "Vui lòng nhập số điện thoại." };
  const phoneOk = /^[0-9+().\s-]{8,15}$/.test(phone);
  if (!phoneOk) return { error: "Số điện thoại chưa đúng định dạng." };

  // Tim chu tin de gan owner cho lead
  const { data: post } = await supabase
    .from("web_posts")
    .select("owner")
    .eq("id", postId)
    .maybeSingle();

  let owner = (post as { owner: string | null } | null)?.owner ?? null;

  // Neu tin khong co chu (tin seed/nhap khau) -> chuyen lead ve admin de khong that lac
  if (!owner) {
    const { data: admin } = await supabase
      .from("profiles")
      .select("id")
      .eq("is_admin", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    owner = (admin as { id: string } | null)?.id ?? null;
  }

  const { error } = await supabase.from("web_post_leads").insert({
    post_id: postId,
    owner,
    name: name || null,
    phone,
    note: note || null,
    is_read: false,
  });

  if (error) {
    console.error("createLead error:", error.message);
    return { error: "Không gửi được thông tin, vui lòng thử lại." };
  }

  revalidatePath("/tai-khoan/khach-hang");
  return { success: true };
}

// Chu tin danh dau da doc lead
export async function markLeadRead(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const idRaw = String(formData.get("id") || "").trim();
  const id = parseInt(idRaw, 10);
  if (!id) return;

  await supabase
    .from("web_post_leads")
    .update({ is_read: true })
    .eq("id", id)
    .eq("owner", user.id);

  revalidatePath("/tai-khoan/khach-hang");
}
