"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getPlan } from "@/lib/plans";

const ADMIN_EMAIL = "daoduykhuyen2@gmail.com";

export type DuyetState = { error?: string; success?: boolean; message?: string };

// Client service-role (bỏ qua RLS) — chỉ dùng SAU khi đã xác thực là admin.
function adminDb() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// Admin duyệt thủ công 1 đơn thanh toán đang chờ (khi webhook tự động không chạy).
export async function adminDuyetThanhToan(
  _prev: DuyetState,
  formData: FormData
): Promise<DuyetState> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập." };

  const { data: prof } = await supabase
    .from("profiles")
    .select("is_admin, role")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin =
    user.email === ADMIN_EMAIL || prof?.is_admin === true || prof?.role === "admin";
  if (!isAdmin) return { error: "Chỉ admin được duyệt thanh toán." };

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return { error: "Thiếu mã đơn." };

  const db = adminDb();

  const { data: order } = await db
    .from("payments")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!order) return { error: "Không tìm thấy đơn." };
  if (order.status === "paid")
    return { success: true, message: "Đơn này đã được thanh toán trước đó." };

  const plan = getPlan(order.plan_code);
  const days = plan?.days || 30;

  // 1) Đánh dấu đã thanh toán
  const { error: upErr } = await db
    .from("payments")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", id);
  if (upErr) return { error: "Lỗi cập nhật đơn: " + upErr.message };

  if (order.plan_code === "NAPTIEN") {
    // Nạp tiền vào ví
    await db.rpc("apply_topup", { p_payment_id: order.id });
    await db.from("notifications").insert({
      tieu_de: "Nạp tiền thành công",
      noi_dung:
        "Bạn đã nạp thành công " +
        Number(order.amount).toLocaleString("vi-VN") +
        "đ vào ví. Số dư đã được cập nhật.",
      loai: "tai_chinh",
      target_user: order.user_id,
      da_doc: false,
    });
    revalidatePath("/admin/nap-tien");
    return { success: true, message: "Đã duyệt lệnh nạp tiền thành công." };
  }

  // 2) Nâng cấp gói / hạng thành viên
  await db.rpc("apply_membership", {
    p_user_id: order.user_id,
    p_plan_code: order.plan_code,
    p_days: days,
  });

  // 3) Áp dụng gói cho tin cụ thể nếu đơn gắn với 1 tin
  if (order.post_id) {
    await db.rpc("apply_post_plan", { p_payment_id: order.id });
  }

  // 4) Gửi thông báo cho khách: đã đăng ký gói thành công
  await db.from("notifications").insert({
    tieu_de: "Đăng ký gói thành công",
    noi_dung:
      "Đơn đăng ký gói " +
      (plan?.name || order.plan_code) +
      " của bạn đã được duyệt và kích hoạt thành công. Cảm ơn bạn đã sử dụng dịch vụ!",
    loai: "tai_chinh",
    target_user: order.user_id,
    da_doc: false,
  });

  revalidatePath("/admin/nap-tien");
  return { success: true, message: "Đã duyệt đơn và kích hoạt gói thành công." };
}
