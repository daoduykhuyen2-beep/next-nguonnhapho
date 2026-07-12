"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Kiem tra user hien tai co phai admin khong.
async function isCurrentUserAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: { id: string; email?: string | null },
): Promise<boolean> {
  if (user.email === "daoduykhuyen2@gmail.com") return true;
  const { data: prof } = await supabase
    .from("profiles")
    .select("is_admin, role")
    .eq("id", user.id)
    .maybeSingle();
  return prof?.is_admin === true || prof?.role === "admin";
}

// Nguoi dung tu bam "Toi da chuyen khoan" -> danh dau don cho admin duyet.
// Chi cap nhat co cho_duyet tren don cua chinh minh (RLS: pay_update_own).
export async function danhDauDaChuyenKhoan(formData: FormData): Promise<void> {
  const orderId = Number(formData.get("order_id"));
  if (!Number.isFinite(orderId)) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Chi danh dau neu don thuoc ve nguoi dung va chua thanh toan.
  await supabase
    .from("payments")
    .update({ cho_duyet: true })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .neq("status", "paid");

  revalidatePath(`/nang-cap/${orderId}`);

  // Neu la admin -> chuyen thang toi muc "Don cho duyet" de duyet tay.
  if (await isCurrentUserAdmin(supabase, user)) {
    redirect("/admin/nap-tien#cho-duyet");
  }
}
