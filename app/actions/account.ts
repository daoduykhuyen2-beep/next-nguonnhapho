"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AccountState = { error?: string; success?: boolean };

export async function updateVat(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập." };
  const payload = {
    id: user.id,
    email: user.email,
    vat_company: String(formData.get("vat_company") || "").trim() || null,
    vat_tax_code: String(formData.get("vat_tax_code") || "").trim() || null,
    vat_address: String(formData.get("vat_address") || "").trim() || null,
    vat_email: String(formData.get("vat_email") || "").trim() || null,
  };
  const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });
  if (error) { console.error("updateVat", error.message); return { error: "Không thể lưu thông tin VAT." }; }
  revalidatePath("/tai-khoan/hoa-don-vat");
  return { success: true };
}

export async function changePassword(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập." };
  const pw = String(formData.get("password") || "");
  const pw2 = String(formData.get("password2") || "");
  if (pw.length < 6) return { error: "Mật khẩu phải từ 6 ký tự trở lên." };
  if (pw !== pw2) return { error: "Mật khẩu nhập lại không khớp." };
  const { error } = await supabase.auth.updateUser({ password: pw });
  if (error) { console.error("changePassword", error.message); return { error: "Không thể đổi mật khẩu." }; }
  return { success: true };
}
