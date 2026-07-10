"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "daoduykhuyen2@gmail.com";

export type ActionState = { error?: string } | undefined;

export async function createPost(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn cần đăng nhập để đăng tin." };
  }

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Vui lòng nhập tiêu đề." };

  const imgsRaw = String(formData.get("imgs") ?? "").trim();
  const imgs = imgsRaw
    ? imgsRaw
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const payload = {
    owner: user.id,
    title,
    loai: String(formData.get("loai") ?? "").trim() || null,
    quan: String(formData.get("quan") ?? "").trim() || null,
    phuong: String(formData.get("phuong") ?? "").trim() || null,
    duong: String(formData.get("duong") ?? "").trim() || null,
    gia: String(formData.get("gia") ?? "").trim() || null,
    dien_tich: String(formData.get("dien_tich") ?? "").trim() || null,
    contact_name: String(formData.get("contact_name") ?? "").trim() || null,
    contact_phone: String(formData.get("contact_phone") ?? "").trim() || null,
    mota: String(formData.get("mota") ?? "").trim() || null,
    video: String(formData.get("video") ?? "").trim() || null,
    anh: imgs.length ? { imgs } : null,
    trang_thai: "duyet",
    status: "thuong",
  };

  const { error } = await supabase.from("web_posts").insert(payload);
  if (error) {
    console.error("createPost error:", error.message);
    return { error: "Không thể lưu tin. Vui lòng thử lại." };
  }

  revalidatePath("/");
  revalidatePath("/tin-dang");
  redirect("/tai-khoan/tin-cua-toi");
}

export async function deletePost(id: number): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Chưa đăng nhập." };

  const isAdmin = user.email === ADMIN_EMAIL;

  let query = supabase.from("web_posts").delete().eq("id", id);
  if (!isAdmin) {
    query = query.eq("owner", user.id);
  }

  const { error } = await query;
  if (error) {
    console.error("deletePost error:", error.message);
    return { error: "Không thể xoá tin." };
  }

  revalidatePath("/");
  revalidatePath("/tin-dang");
  revalidatePath("/tai-khoan/tin-cua-toi");
  revalidatePath("/admin");
  return undefined;
}
