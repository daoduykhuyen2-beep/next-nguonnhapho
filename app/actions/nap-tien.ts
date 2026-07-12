"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";

// Kiem tra user hien tai co phai admin khong.
async function isCurrentUserAdmin(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
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

// Nội dung chuyển khoản riêng cho lệnh nạp tiền.
function buildTopupContent(userId: string) {
  // Mã thanh toán: tiền tố NNP + 8 chữ số tự động (duy nhất mỗi lệnh).
  // Khớp với cấu hình mã thanh toán SePay: Tiền tố = NNP, Hậu tố = số.
  void userId;
  const so = String(Date.now()).slice(-8);
  return "NNP" + so;
}

// 1) Tạo lệnh nạp tiền (pending) -> chuyển tới trang thanh toán chuyển khoản.
export async function createTopupOrder(formData: FormData): Promise<void> {
  const raw = String(formData.get("amount_custom") || "").trim() || String(formData.get("amount") || "").trim();
  const amount = Math.round(Number(raw.replace(/[^0-9]/g, "")));
  if (!Number.isFinite(amount) || amount < 10000) {
    redirect("/tai-khoan/nap-tien?error=amount");
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/tai-khoan/nap-tien");

  const content = buildTopupContent(user.id);
  const { data, error } = await supabase
    .from("payments")
    .insert({
      user_id: user.id,
      plan_code: "NAPTIEN",
      amount,
      transfer_content: content,
      status: "pending",
    })
    .select("id")
    .single();
  if (error || !data) redirect("/tai-khoan/nap-tien?error=order");

  redirect(`/nang-cap/${data.id}`);
}

// 2) "Thanh toán bằng số dư" -> KHÔNG tự trừ tiền / tự nâng cấp nữa.
//    Chỉ đánh dấu đơn chờ admin duyệt tay (giống nút "Tôi đã chuyển khoản").
export async function payPackageWithBalance(formData: FormData): Promise<void> {
  const orderId = Number(formData.get("order_id"));
  if (!Number.isFinite(orderId)) redirect("/goi-thanh-vien?error=order");

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/goi-thanh-vien");

  const { data: order } = await supabase
    .from("payments")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!order) redirect("/goi-thanh-vien?error=order");
  if (order.status === "paid") redirect("/tai-khoan?paid=1");

  // Đánh dấu đơn chờ admin duyệt (thay vì tự trừ số dư qua RPC pay_with_balance).
  await supabase
    .from("payments")
    .update({ cho_duyet: true })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .neq("status", "paid");

  revalidatePath(`/nang-cap/${orderId}`);

  // Admin -> nhảy thẳng tới mục "Đơn chờ duyệt" để duyệt tay.
  if (await isCurrentUserAdmin(supabase, user)) {
    redirect("/admin/nap-tien#cho-duyet");
  }

  // Khách thường -> quay lại trang thanh toán, hiển thị trạng thái chờ duyệt.
  redirect(`/nang-cap/${orderId}`);
}
