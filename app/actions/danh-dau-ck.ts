"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Người dùng tự bấm "Tôi đã chuyển khoản" -> đánh dấu đơn chờ admin duyệt.
// Chỉ cập nhật cờ cho_duyet trên đơn của chính mình (RLS: pay_update_own).
export async function danhDauDaChuyenKhoan(formData: FormData): Promise<void> {
  const orderId = Number(formData.get("order_id"));
  if (!Number.isFinite(orderId)) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Chỉ đánh dấu nếu đơn thuộc về người dùng và chưa thanh toán.
  await supabase
    .from("payments")
    .update({ cho_duyet: true })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .neq("status", "paid");

  revalidatePath("/nang-cap/" + orderId);
}
