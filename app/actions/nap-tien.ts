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
  return "NAPTIEN" + userId.replace(/-/g, "").slice(0, 12).toUpperCase();
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

  // Trừ số dư + cộng vào phần đã sử dụng
  const { data: profUse } = await db
    .from("profiles")
    .select("da_su_dung")
    .eq("id", user!.id)
    .maybeSingle();
  await db
    .from("profiles")
    .update({
      so_du: soDu - Number(order.amount),
      da_su_dung: Number(profUse?.da_su_dung || 0) + Number(order.amount),
    })
    .eq("id", user!.id);
  await db.rpc("apply_membership", {
    p_user_id: user!.id,
    p_plan_code: order.plan_code,
    p_days: days,
  });
  await db
    .from("payments")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", orderId);
  if (order.post_id) {
    await db.rpc("apply_post_plan", { p_payment_id: orderId });
  }

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
