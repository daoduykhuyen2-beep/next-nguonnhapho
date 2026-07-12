"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "daoduykhuyen2@gmail.com";

export type ActionState = { error?: string };

// Nhận ảnh: ưu tiên JSON array (từ form upload), fallback comma-separated URLs.
function parseImgs(raw: string): string[] {
  const s = (raw || "").trim();
  if (!s) return [];
  if (s.startsWith("[")) {
    try {
      const arr = JSON.parse(s);
      if (Array.isArray(arr)) return arr.map((x) => String(x).trim()).filter(Boolean);
    } catch {}
  }
  return s.split(/[,\n]/).map((x) => x.trim()).filter(Boolean);
}

function buildPayload(formData: FormData) {
  const imgs = parseImgs(String(formData.get("anh") || formData.get("imgs") || ""));
  return {
    title: String(formData.get("title") || "").trim(),
    loai: String(formData.get("loai") || "").trim() || null,
    quan: String(formData.get("quan") || "").trim() || null,
    phuong: String(formData.get("phuong") || "").trim() || null,
    duong: String(formData.get("duong") || "").trim() || null,
    gia: String(formData.get("gia") || "").trim() || null,
    dien_tich: String(formData.get("dien_tich") || "").trim() || null,
    chieu_ngang: String(formData.get("chieu_ngang") || "").trim() || null,
    chieu_dai: String(formData.get("chieu_dai") || "").trim() || null,
    so_tang: String(formData.get("so_tang") || "").trim() || null,
    contact_name: String(formData.get("contact_name") || "").trim() || null,
    contact_phone: String(formData.get("contact_phone") || "").trim() || null,
    mota: String(formData.get("mota") || "").trim() || null,
    video: String(formData.get("video") || "").trim() || null,
    anh: imgs.length ? imgs : null,
  };
}

export async function createPost(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập để đăng tin." };

  const base = buildPayload(formData);
  if (!base.title) return { error: "Vui lòng nhập tiêu đề." };

  const { error } = await supabase.from("web_posts").insert({
    ...base,
    owner: user.id,
    trang_thai: "duyet",
    status: "thuong",
  });

  if (error) {
    console.error("createPost error:", error.message);
    return { error: "Không thể lưu tin. Vui lòng thử lại." };
  }

  revalidatePath("/");
  revalidatePath("/tin-dang");
  redirect("/tai-khoan/tin-cua-toi");
}

export async function updatePost(
  id: number,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập." };

  const base = buildPayload(formData);
  if (!base.title) return { error: "Vui lòng nhập tiêu đề." };

  const isAdmin = user.email === ADMIN_EMAIL;
  let query = supabase.from("web_posts").update(base).eq("id", id);
  if (!isAdmin) query = query.eq("owner", user.id);

  const { error } = await query;
  if (error) {
    console.error("updatePost error:", error.message);
    return { error: "Không thể cập nhật tin. Vui lòng thử lại." };
  }

  revalidatePath("/");
  revalidatePath("/tin-dang");
  revalidatePath("/tin-dang/" + id);
  redirect("/tai-khoan/tin-cua-toi");
}

export async function deletePost(id: number): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const isAdmin = user.email === ADMIN_EMAIL;
  let query = supabase.from("web_posts").delete().eq("id", id);
  if (!isAdmin) query = query.eq("owner", user.id);

  await query;
  revalidatePath("/");
  revalidatePath("/tin-dang");
  revalidatePath("/tai-khoan/tin-cua-toi");
}
