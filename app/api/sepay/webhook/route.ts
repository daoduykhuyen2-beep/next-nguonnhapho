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
  const auth = req.headers.get("authorization") || "";
  const expected = "Apikey " + (process.env.SEPAY_WEBHOOK_API_KEY || "");
  if (!process.env.SEPAY_WEBHOOK_API_KEY || auth !== expected) {
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
  const norm = (s: string) => s.replace(/\s+/g, "").toUpperCase();
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

  await supabase
    .from("payments")
    .update({ status: "paid", sepay_ref: sepayRef, paid_at: new Date().toISOString() })
    .eq("id", order.id);

  await supabase.rpc("apply_membership", {
    p_user_id: order.user_id,
    p_plan_code: order.plan_code,
    p_days: days,
  });

  return NextResponse.json({ success: true, matched: true, paid: true });
}
