"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { error?: string; success?: boolean };

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập." };

  const payload: Record<string, unknown> = {
    id: user.id,
    email: user.email,
    full_name: String(formData.get("full_name") || "").trim() || null,
    phone: String(formData.get("phone") || "").trim() || null,
    address: String(formData.get("address") || "").trim() || null,
    bio: String(formData.get("bio") || "").trim() || null,
  };

  const ageRaw = String(formData.get("age") || "").trim();
  if (ageRaw) {
    const n = parseInt(ageRaw, 10);
    if (!Number.isNaN(n)) payload.age = n;
  }
  const gender = String(formData.get("gender") || "").trim();
  if (gender) payload.gender = gender;

  // upsert để tạo hàng nếu chưa có, hoặc cập nhật nếu đã tồn tại
  const { error } = await supabase.from("profiles").upsert(payload, {
    onConflict: "id",
  });

  if (error) {
    console.error("updateProfile error:", error.message);
    return { error: "Không thể lưu thông tin. Vui lòng thử lại." };
  }

  revalidatePath("/tai-khoan");
  revalidatePath("/tai-khoan/thong-tin");
  return { success: true };
}
