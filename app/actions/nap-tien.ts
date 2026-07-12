"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getPlanMerged } from "@/lib/plans-server";
import { getEffectivePrice } from "@/lib/plans";

function adminDb() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
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

  const content = buildTopupContent(user!.id);

  const { data, error } = await supabase
    .from("payments")
    .insert({
      user_id: user!.id,
      plan_code: "NAPTIEN",
      amount,
      transfer_content: content,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/tai-khoan/nap-tien?error=order");
  }

  redirect("/nang-cap/" + data!.id);
}

// 2) Thanh toán 1 gói bằng số dư ví (trừ tiền tự động).
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
    .eq("user_id", user!.id)
    .maybeSingle();
  if (!order) redirect("/goi-thanh-vien?error=order");
  if (order.status === "paid") redirect("/tai-khoan?paid=1");

  const { data: prof } = await supabase
    .from("profiles")
    .select("so_du")
    .eq("id", user!.id)
    .maybeSingle();
  const soDu = Number(prof?.so_du || 0);
  if (soDu < Number(order.amount)) {
    redirect("/nang-cap/" + orderId + "?error=nsf");
  }

  const db = adminDb();
  const plan = await getPlanMerged(order.plan_code);
  const days = plan?.days || 30;

  // Trừ số dư + cộng gói NGUYÊN TỬ (atomic) qua RPC pay_with_balance.
  // RPC khoá dòng (FOR UPDATE), kiểm tra đủ số dư, chống trừ trùng & race.
  const { data: payResult, error: payErr } = await db.rpc("pay_with_balance", {
    p_payment_id: orderId,
    p_days: days,
  });
  if (payErr) {
    console.error("payPackageWithBalance error:", payErr.message);
    redirect("/tai-khoan?error=paybalance&order=" + orderId);
  }
  if (payResult === "insufficient") {
    redirect("/tai-khoan/nap-tien?thieu=1&order=" + orderId);
  }
  if (payResult === "not_found") {
    redirect("/tai-khoan?error=order");
  }
  // 'ok' hoặc 'already_paid' -> coi như thành công, tiếp tục gửi thông báo.

  await db.from("notifications").insert({
    tieu_de: "Đăng ký gói thành công",
    noi_dung:
      "Bạn đã thanh toán gói " +
      (plan?.name || order.plan_code) +
      " bằng số dư ví thành công. Gói đã được kích hoạt.",
    loai: "tai_chinh",
    target_user: user!.id,
    da_doc: false,
  });

  revalidatePath("/tai-khoan");
  redirect("/tai-khoan?paid=1");
}
