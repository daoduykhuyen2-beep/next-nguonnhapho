"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type JobApplyState = { error?: string; success?: boolean };

export async function createJobApplication(
  _prev: JobApplyState,
  formData: FormData
): Promise<JobApplyState> {
  const supabase = await createClient();

  const hoTen = String(formData.get("ho_ten") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const viTri = String(formData.get("vi_tri") ?? "").trim();
  const loiNhan = String(formData.get("loi_nhan") ?? "").trim();

  if (!phone) return { error: "Vui lòng nhập số điện thoại." };
  const phoneOk = /^0\d{9,10}$/.test(phone.replace(/[\s.\-]/g, ""));
  if (!phoneOk) return { error: "Số điện thoại chưa đúng định dạng." };

  const { error } = await supabase.from("job_applications").insert({
    ho_ten: hoTen || null,
    phone,
    vi_tri: viTri || null,
    loi_nhan: loiNhan || null,
    is_read: false,
  });

  if (error) {
    console.error("createJobApplication error:", error.message);
    return { error: "Không gửi được hồ sơ, vui lòng thử lại." };
  }

  return { success: true };
}

export async function markJobApplicationRead(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: prof } = await supabase
    .from("profiles")
    .select("is_admin, role")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin =
    user.email === "daoduykhuyen2@gmail.com" ||
    prof?.is_admin === true ||
    prof?.role === "admin";
  if (!isAdmin) return;

  const id = parseInt(String(formData.get("id") ?? "").trim(), 10);
  if (!id) return;

  await supabase
    .from("job_applications")
    .update({ is_read: true })
    .eq("id", id);

  revalidatePath("/admin/ung-tuyen");
}
