"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type LeadState = { error?: string; success?: boolean };

// Khach de lai so dien thoai tren mot tin dang -> tao lead cho chu tin
export async function createLead(
  _prev: LeadState,
  formData: FormData
): Promise<LeadState> {
  const postId = Number(formData.get("post_id"));
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const note = String(formData.get("note") || "").trim();

  if (!postId || Number.isNaN(postId)) return { error: "Tin khong hop le." };
  if (!phone) return { error: "Vui long nhap so dien thoai." };
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length < 8 || digits.length > 15)
    return { error: "So dien thoai khong hop le." };

  const supabase = await createClient();

  // Lay owner cua tin de gan lead
  const { data: post } = await supabase
    .from("web_posts")
    .select("owner")
    .eq("id", postId)
    .maybeSingle();

  const { error } = await supabase.from("web_post_leads").insert({
    post_id: postId,
    owner: post?.owner ?? null,
    name: name || null,
    phone,
    note: note || null,
  });

  if (error) {
    console.error("createLead error:", error.message);
    return { error: "Khong the gui thong tin. Vui long thu lai." };
  }

  return { success: true };
}

// Chu tin danh dau da doc / chua doc
export async function toggleLeadRead(leadId: number, isRead: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Ban can dang nhap." };

  const { error } = await supabase
    .from("web_post_leads")
    .update({ is_read: isRead })
    .eq("id", leadId)
    .eq("owner", user.id);

  if (error) return { error: error.message };
  revalidatePath("/tai-khoan/khach-hang");
  return { success: true };
}

// Chu tin xoa lead
export async function deleteLead(leadId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Ban can dang nhap." };

  const { error } = await supabase
    .from("web_post_leads")
    .delete()
    .eq("id", leadId)
    .eq("owner", user.id);

  if (error) return { error: error.message };
  revalidatePath("/tai-khoan/khach-hang");
  return { success: true };
}
