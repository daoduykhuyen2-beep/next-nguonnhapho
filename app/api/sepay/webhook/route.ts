import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPlan } from "@/lib/plans";

// SePay gọi webhook này mỗi khi có giao dịch tiền vào tài khoản.
// Docs SePay: gửi POST JSON, xác thực bằng header "Authorization: Apikey <key>".
// Không dùng anon key ở đây - phải dùng SERVICE ROLE để ghi/bỏ qua RLS.

export const dynamic = "force-dynamic";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  // 1) Xác thực API key từ SePay
  const auth = (req.headers.get("authorization") || "").trim();
  const key = (process.env.SEPAY_WEBHOOK_API_KEY || "").trim();
  const provided = auth.replace(/^Apikey\s+/i, "").trim();
  if (!key || provided !== key) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "bad json" }, { status: 400 });
  }

  // 2) Chỉ xử lý tiền VÀO (transferType === "in")
  const transferType = body.transferType || body.transfer_type;
  if (transferType && transferType !== "in") {
    return NextResponse.json({ success: true, skipped: "not incoming" });
  }

  const content: string = String(body.content || body.description || "");
  const amount: number = Number(
    body.transferAmount || body.amount || body.transfer_amount || 0
  );
  const sepayRef: string = String(
    body.referenceCode || body.id || body.reference_number || ""
  );

  const supabase = admin();

  // 3) Tìm đơn pending có nội dung khớp (so khớp không phân biệt hoa thường,
  //    bỏ khoảng trắng để chịu được việc ngân hàng chèn thêm ký tự).
  const norm = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const contentNorm = norm(content);

  const { data: pendings } = await supabase
    .from("payments")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(200);

  const order = (pendings || []).find((p: any) =>
    contentNorm.includes(norm(p.transfer_content))
  );

  if (!order) {
    // Vẫn trả 200 để SePay không gửi lại; ghi log để đối soát thủ công.
    console.warn("SePay webhook: no matching order for content", content);
    return NextResponse.json({ success: true, matched: false });
  }

  // 4) Kiểm tra số tiền đủ
  if (amount < order.amount) {
    console.warn("SePay webhook: amount too low", amount, "<", order.amount);
    return NextResponse.json({ success: true, matched: true, paid: false });
  }

  // 5) Đánh dấu đã thanh toán + nâng cấp gói
  const plan = getPlan(order.plan_code);
  const days = plan?.days || 30;

  // Đánh dấu paid CÓ ĐIỀU KIỆN status='pending' để chống cộng trùng (idempotency).
  // Nếu 2 webhook tới cùng lúc, chỉ 1 request cập nhật được -> chỉ 1 lần cộng gói.
  const { data: paidRows, error: paidErr } = await supabase
    .from("payments")
    .update({ status: "paid", sepay_ref: sepayRef, paid_at: new Date().toISOString() })
    .eq("id", order.id)
    .eq("status", "pending")
    .select("id");
  if (paidErr) {
    console.error("SePay webhook: update paid failed", paidErr.message);
    return NextResponse.json({ success: false, error: "db update failed" }, { status: 500 });
  }
  if (!paidRows || paidRows.length === 0) {
    // Đơn đã được xử lý trước đó (webhook gửi lại) -> bỏ qua, không cộng lần 2.
    return NextResponse.json({ success: true, matched: true, alreadyProcessed: true });
  }

  if (order.plan_code === "NAPTIEN") {
    // Nạp tiền vào ví: cộng số dư + gửi thông báo "nạp tiền thành công".
    const { error: topupErr } = await supabase.rpc("apply_topup", { p_payment_id: order.id });
    if (topupErr) {
      console.error("SePay webhook: apply_topup failed", topupErr.message);
      return NextResponse.json({ success: false, error: "topup failed" }, { status: 500 });
    }
    await supabase.from("notifications").insert({
      tieu_de: "Nạp tiền thành công",
      noi_dung:
        "Bạn đã nạp thành công " +
        Number(order.amount).toLocaleString("vi-VN") +
        "đ vào ví. Số dư đã được cập nhật.",
      loai: "tai_chinh",
      target_user: order.user_id,
      da_doc: false,
    });

    // Thong bao cho admin de vao kiem tra
    const { data: __admins } = await supabase.from("profiles").select("id").eq("is_admin", true);
    if (__admins?.length) {
      await supabase.from("notifications").insert(
        __admins.map((__a: any) => ({
          tieu_de: "Khách vừa nạp tiền",
          noi_dung: `Có khách (ID: ${order.user_id}) vừa nạp thành công ${Number(order.amount).toLocaleString("vi-VN")}đ. Vào kiểm tra.`,
          loai: "he_thong",
          target_user: __a.id,
          da_doc: false,
        })),
      );
    }
    return NextResponse.json({ success: true, matched: true, paid: true });
  }

  const { error: memErr } = await supabase.rpc("apply_membership", {
    p_user_id: order.user_id,
    p_plan_code: order.plan_code,
    p_days: days,
  });
  if (memErr) {
    console.error("SePay webhook: apply_membership failed", memErr.message);
    return NextResponse.json({ success: false, error: "membership failed" }, { status: 500 });
  }

  // Áp dụng gói cho tin cụ thể (VIP Kim Cương/Vàng hoặc đẩy tin) nếu đơn gắn với 1 tin.
  if (order.post_id) {
    const { error: postErr } = await supabase.rpc("apply_post_plan", { p_payment_id: order.id });
    if (postErr) {
      console.error("SePay webhook: apply_post_plan failed", postErr.message);
      return NextResponse.json({ success: false, error: "post plan failed" }, { status: 500 });
    }
  }

  // Gửi thông báo đăng ký gói thành công.
  await supabase.from("notifications").insert({
    tieu_de: "Đăng ký gói thành công",
    noi_dung:
      "Gói " +
      order.plan_code +
      " của bạn đã được thanh toán và kích hoạt thành công. Cảm ơn bạn!",
    loai: "tai_chinh",
    target_user: order.user_id,
    da_doc: false,
  });

  // Thong bao cho admin de vao kiem tra
  const { data: __admins } = await supabase.from("profiles").select("id").eq("is_admin", true);
  if (__admins?.length) {
    await supabase.from("notifications").insert(
      __admins.map((__a: any) => ({
        tieu_de: "Khách vừa đăng ký gói",
        noi_dung: `Có khách (ID: ${order.user_id}) vừa đăng ký gói ${order.plan_code}. Vào kiểm tra.`,
        loai: "he_thong",
        target_user: __a.id,
        da_doc: false,
      })),
    );
  }

  return NextResponse.json({ success: true, matched: true, paid: true });
}
