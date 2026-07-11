"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "daoduykhuyen2@gmail.com";

/**
 * Đăng lại tin (gia hạn): đặt lại ngày hết hạn = now() + 15 ngày,
 * chuyển trạng thái về "duyet" (đang hiển thị). Chỉ tác động tin của chính chủ.
 */
export async function renewPost(id: number): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const isAdmin = user.email === ADMIN_EMAIL;
  let query = supabase
    .from("web_posts")
    .update({
      ngay_het_han: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      trang_thai: "duyet",
    })
    .eq("id", id);
  if (!isAdmin) query = query.eq("owner", user.id);

  const { error } = await query;
  if (error) console.error("renewPost error:", error.message);

  revalidatePath("/");
  revalidatePath("/tin-dang");
  revalidatePath(`/tin-dang/${id}`);
  revalidatePath("/tai-khoan/tin-cua-toi");
}

/**
 * Hạ tin: đặt trạng thái = "da_ha" (ẩn khỏi danh sách công khai).
 * Chỉ tác động tin của chính chủ (hoặc admin).
 */
export async function unlistPost(id: number): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const isAdmin = user.email === ADMIN_EMAIL;
  let query = supabase
    .from("web_posts")
    .update({ trang_thai: "da_ha" })
    .eq("id", id);
  if (!isAdmin) query = query.eq("owner", user.id);

  const { error } = await query;
  if (error) console.error("unlistPost error:", error.message);

  revalidatePath("/");
  revalidatePath("/tin-dang");
  revalidatePath(`/tin-dang/${id}`);
  revalidatePath("/tai-khoan/tin-cua-toi");
}
