"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getPlan } from "@/lib/plans";

const ADMIN_EMAIL = "daoduykhuyen2@gmail.com";

export type NapState = { error?: string; success?: boolean; message?: string };

// Client service-role (bo qua RLS) - chi dung SAU khi da xac thuc la admin.
function adminDb() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// Xac thuc admin, tra ve db service-role neu hop le.
async function requireAdminDb() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, db: null };
  const { data: prof } = await supabase
    .from("profiles")
    .select("is_admin, role")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin =
    user.email === ADMIN_EMAIL || prof?.is_admin === true || prof?.role === "admin";
  if (!isAdmin) return { ok: false as const, db: null };
  return { ok: true as const, db: adminDb() };
}

// Tim user theo email tren bang profiles.
async function timUserTheoEmail(
  db: ReturnType<typeof adminDb>,
  email: string,
): Promise<{ id: string; email: string | null } | null> {
  const clean = email.trim().toLowerCase();
  if (!clean) return null;
  const { data } = await db
    .from("profiles")
    .select("id, email")
    .eq("email", clean)
    .maybeSingle();
  return data ? { id: data.id as string, email: (data.email as string) ?? null } : null;
}

// (a) Cong so du vi cho mot tai khoan theo email - KHONG gioi han, khong can chuyen khoan.
export async function adminCongSoDu(_prev: NapState, formData: FormData): Promise<NapState> {
  const { ok, db } = await requireAdminDb();
  if (!ok || !db) return { error: "Chi admin duoc thao tac." };

  const email = String(formData.get("email") || "").trim();
  const amount = Math.round(Number(String(formData.get("amount") || "").replace(/[^0-9-]/g, "")));
  if (!email) return { error: "Nhap email tai khoan." };
  if (!Number.isFinite(amount) || amount === 0) return { error: "Nhap so tien hop le (khac 0)." };

  const u = await timUserTheoEmail(db, email);
  if (!u) return { error: "Khong tim thay tai khoan voi email nay." };

  // Doc so du hien tai roi cong them (cho phep so am de tru bot neu can).
  const { data: prof } = await db.from("profiles").select("so_du").eq("id", u.id).maybeSingle();
  const hienTai = Number(prof?.so_du || 0);
  const moi = hienTai + amount;
  const { error } = await db.from("profiles").update({ so_du: moi }).eq("id", u.id);
  if (error) return { error: "Loi cap nhat so du: " + error.message };

  await db.from("notifications").insert({
    tieu_de: "So du duoc dieu chinh",
    noi_dung:
      (amount > 0 ? "Ban duoc cong " : "Tai khoan bi tru ") +
      Math.abs(amount).toLocaleString("vi-VN") +
      "d vao vi. So du hien tai: " + moi.toLocaleString("vi-VN") + "d.",
    loai: "tai_chinh",
    target_user: u.id,
    da_doc: false,
  });

  revalidatePath("/admin/nap-tien");
  return { success: true, message: "Da cong " + amount.toLocaleString("vi-VN") + "d cho " + email + ". So du moi: " + moi.toLocaleString("vi-VN") + "d." };
}

// (b) Kich hoat goi truc tiep cho mot tai khoan theo email - khong can thanh toan.
export async function adminKichHoatGoi(_prev: NapState, formData: FormData): Promise<NapState> {
  const { ok, db } = await requireAdminDb();
  if (!ok || !db) return { error: "Chi admin duoc thao tac." };

  const email = String(formData.get("email") || "").trim();
  const planCode = String(formData.get("plan_code") || "").trim();
  if (!email) return { error: "Nhap email tai khoan." };
  const plan = getPlan(planCode);
  if (!plan) return { error: "Goi khong hop le." };

  const u = await timUserTheoEmail(db, email);
  if (!u) return { error: "Khong tim thay tai khoan voi email nay." };

  const days = plan.days || 30;
  const { error } = await db.rpc("apply_membership", {
    p_user_id: u.id,
    p_plan_code: plan.code,
    p_days: days,
  });
  if (error) return { error: "Loi kich hoat goi: " + error.message };

  await db.from("notifications").insert({
    tieu_de: "Kich hoat goi thanh cong",
    noi_dung: "Ban da duoc kich hoat goi " + plan.name + ". Chuc ban dang tin hieu qua!",
    loai: "tai_chinh",
    target_user: u.id,
    da_doc: false,
  });

  revalidatePath("/admin/nap-tien");
  return { success: true, message: "Da kich hoat goi " + plan.name + " cho " + email + "." };
}

// Reset doanh thu: luu moc thoi gian hien tai vao app_settings.
// Doanh thu se chi tinh cac giao dich paid_at >= moc nay.
export async function adminResetDoanhThu(_prev: NapState, _formData: FormData): Promise<NapState> {
  const { ok, db } = await requireAdminDb();
  if (!ok || !db) return { error: "Chi admin duoc thao tac." };

  const now = new Date().toISOString();
  const { error } = await db
    .from("app_settings")
    .upsert({ key: "revenue_reset_at", value: now }, { onConflict: "key" });
  if (error) return { error: "Loi luu moc reset: " + error.message };

  revalidatePath("/admin/nap-tien");
  return { success: true, message: "Da reset doanh thu. Tu bay gio chi tinh cac giao dich moi." };
}
