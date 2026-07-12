"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "daoduykhuyen2@gmail.com";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, supabase, user: null };
  const { data: prof } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  const isAdmin = user.email === ADMIN_EMAIL || prof?.is_admin === true;
  return { ok: isAdmin, supabase, user };
}

async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Chưa đăng nhập.");
  const { data: prof } = await supabase
    .from("profiles")
    .select("role, is_admin")
    .eq("id", user.id)
    .maybeSingle();
  const role = prof?.role;
  const ok = role === "admin" || role === "pho_cong_dong" || prof?.is_admin === true;
  if (!ok) throw new Error("Chỉ nhân sự quản trị mới được thao tác.");
  return { ok: true as const, supabase, user, role: role ?? (prof?.is_admin ? "admin" : "member") };
}

export type AdminState = { error?: string; success?: boolean };

// ----- Bai dang -----
export async function adminUpdatePost(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const { ok, supabase } = await requireStaff();
  if (!ok) return { error: "Không có quyền." };
  const id = Number(formData.get("id"));
  const payload: Record<string, unknown> = {
    title: String(formData.get("title") || "").trim() || null,
    gia: String(formData.get("gia") || "").trim() || null,
    dien_tich: String(formData.get("dien_tich") || "").trim() || null,
    quan: String(formData.get("quan") || "").trim() || null,
    mota: String(formData.get("mota") || "").trim() || null,
    status: String(formData.get("status") || "").trim() || null,
    trang_thai: String(formData.get("trang_thai") || "").trim() || null,
  };
  const { error } = await supabase.from("web_posts").update(payload).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/bai-dang");
  return { success: true };
}

export async function adminSetPostState(id: number, trang_thai: string) {
  const { ok, supabase } = await requireStaff();
  if (!ok) return;
  await supabase.from("web_posts").update({ trang_thai }).eq("id", id);
  revalidatePath("/admin/bai-dang");
}

// ----- Thanh vien -----
export async function adminUpdateMember(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const { ok, supabase } = await requireAdmin();
  if (!ok) return { error: "Không có quyền." };
  const id = String(formData.get("id"));
  const payload: Record<string, unknown> = {
    full_name: String(formData.get("full_name") || "").trim() || null,
    phone: String(formData.get("phone") || "").trim() || null,
    membership_tier: String(formData.get("membership_tier") || "").trim() || null,
    is_admin: String(formData.get("is_admin") || "") === "on",
  };
  const { error } = await supabase.from("profiles").update(payload).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/thanh-vien");
  return { success: true };
}

// ----- Tin tuc -----
export async function adminSaveNews(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const { ok, supabase } = await requireStaff();
  if (!ok) return { error: "Không có quyền." };
  const idRaw = String(formData.get("id") || "").trim();
  const payload: Record<string, unknown> = {
    tieu_de: String(formData.get("tieu_de") || "").trim(),
    mo_ta: String(formData.get("mo_ta") || "").trim() || null,
    noi_dung: String(formData.get("noi_dung") || "").trim() || null,
    anh_bia: String(formData.get("anh_bia") || "").trim() || null,
    loai: String(formData.get("loai") || "tin_tuc").trim(),
  };
  let error;
  if (idRaw) {
    ({ error } = await supabase.from("news").update(payload).eq("id", Number(idRaw)));
  } else {
    ({ error } = await supabase.from("news").insert(payload));
  }
  if (error) return { error: error.message };
  revalidatePath("/admin/tin-tuc");
  revalidatePath("/tin-tuc");
  return { success: true };
}

// ----- Thong bao / khuyen mai -----
export async function adminSendNotification(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const { ok, supabase } = await requireStaff();
  if (!ok) return { error: "Không có quyền." };
  const payload = {
    tieu_de: String(formData.get("tieu_de") || "").trim(),
    noi_dung: String(formData.get("noi_dung") || "").trim() || null,
    loai: String(formData.get("loai") || "thong_bao").trim(),
  };
  if (!payload.tieu_de) return { error: "Nhập tiêu đề thông báo." };
  // Neu admin nhap email nguoi nhan -> gui rieng cho nguoi do; de trong -> gui chung
    const __email = String(formData.get("email_nguoi_nhan") ?? "").trim().toLowerCase();
    let __target: string | null = null;
    if (__email) {
      const { data: __u } = await supabase.from("profiles").select("id").eq("email", __email).maybeSingle();
      if (!__u) return { error: "Khong tim thay tai khoan voi email nay." };
      __target = __u.id;
    }
    const __payload = { ...payload, target_user: __target, da_doc: false };
    const { error } = await supabase.from("notifications").insert(__payload);
  if (error) return { error: error.message };
  revalidatePath("/admin/thong-bao");
  return { success: true };
}


// Gán vai trò cho một thành viên (CHỈ ADMIN).
// role hợp lệ: 'admin' | 'pho_cong_dong' | 'member'
export async function adminSetRole(userId: string, role: string) {
  await requireAdmin();
  if (!["admin", "pho_cong_dong", "member"].includes(role)) {
    return { error: "Vai trò không hợp lệ." };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role, is_admin: role === "admin" })
    .eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/phan-quyen");
  return { success: true };
}
